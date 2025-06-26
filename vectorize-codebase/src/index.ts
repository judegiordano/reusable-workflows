import { pipeline } from '@xenova/transformers'
import glob from 'fast-glob'
import { DB_PATH, MODEL, SHA, WORKSPACE } from './config'
import type { Data } from './types'
import { bulkInsert, db, migrate } from './sql'
import { EXCLUDE, INCLUDE } from './args'
import { parseContent } from './file'
import { log } from './logger'

log.debug({ SHA, WORKSPACE, INCLUDE, EXCLUDE, DB_PATH })
//
migrate()
//
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
for (const entry of entries) {
	iter++
	try {
		const { content, file, path } = parseContent(entry)
		log.info(`[${iter}/${total}] processing: ${file}`)
		if (!content.length) {
			log.warn(`skipping empty content: ${file}`)
			continue
		}
		const embed = await embedder(content, { pooling: 'mean' })
		const vector: number[] = Array.from(embed.data)
		embeddings.push({ path, file, content, vector })
		if (embeddings.length === 100 || iter >= total) {
			bulkInsert(embeddings)
			// clear
			embeddings.length = 0
		}
	} catch (error) {
		log.warn(`error processing: ${entry}: ${error}`)
	}
}

db.close(false)
