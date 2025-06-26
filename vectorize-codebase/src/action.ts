import { pipeline } from '@xenova/transformers'
import glob from 'fast-glob'
import { BULK_WRITE_CHUNK, DB_PATH, MODEL, SHA, WORKSPACE } from './config'
import type { Data } from './types'
import { bulkInsert, db, migrate } from './sql'
import { EXCLUDE, INCLUDE } from './args'
import { parseContent } from './file'
import { log } from './logger'

export async function run() {
	log.debug({ SHA, WORKSPACE, INCLUDE, EXCLUDE, DB_PATH })
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
	log.debug(`${total} matched files`)

	const embedder = await pipeline('feature-extraction', MODEL)
	const embeddings: Data[] = []
	let iter = 0

	// process
	for (const entry of entries) {
		iter++
		try {
			const { content, file, path } = parseContent(entry)
			log.info(`[${iter}/${total}] processing: ${file}`)
			if (!content.length) {
				log.warn(`skipping empty content: ${file}`)
				continue
			}
			const { data } = await embedder(content, { pooling: 'mean' })
			embeddings.push({
				path,
				file,
				content,
				vector: Array.from(data)
			})
			if (embeddings.length === BULK_WRITE_CHUNK || iter >= total) {
				bulkInsert(embeddings)
				embeddings.length = 0
			}
		} catch (error) {
			log.warn(`error processing: ${entry}: ${error}`)
		}
	}

	db.close(false)
}
