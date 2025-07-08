import { pipeline } from '@xenova/transformers'
import glob from 'fast-glob'
import { logger } from '@reusable-workflows/logger'
import type { Data } from './types'
import { bulkInsert, db, migrate } from './sql'
import { EXCLUDE, INCLUDE, BULK_WRITE_CHUNK, DB_PATH, MODEL, SHA, WORKSPACE, REPO_NAME } from './args'
import { parseContent } from './file'

export async function run() {
	logger.debug({ SHA, REPO_NAME, WORKSPACE, INCLUDE, EXCLUDE, DB_PATH })
	// prepare db
	migrate()

	// Find files to process
	const entries = await glob(INCLUDE, {
		dot: true,
		onlyFiles: true,
		followSymbolicLinks: false,
		ignore: EXCLUDE
	})
	const total = entries.length
	logger.debug(`${total} matched files`)

	const embedder = await pipeline('feature-extraction', MODEL)
	const embeddings: Data[] = []
	let iter = 0

	// process
	for (const entry of entries) {
		iter++
		try {
			const { content, file, path } = parseContent(entry)
			logger.info(`[${iter}/${total}] processing: ${file}`)
			if (!content.length) {
				logger.warn(`skipping empty content: ${file}`)
				continue
			}
			const { data } = await embedder(content, { pooling: 'mean' })
			embeddings.push({
				path,
				file,
				content,
				vector: Array.from(data)
			})
			logger.info({ embeddings_len: embeddings.length, iter: iter })
			if (embeddings.length === BULK_WRITE_CHUNK || iter >= total) {
				logger.info('HIT')
				bulkInsert(embeddings)
				embeddings.length = 0
			}
		} catch (error) {
			logger.warn(`error processing: ${entry}: ${error}`)
		}
	}

	db.close(false)
}
