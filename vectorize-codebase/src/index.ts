import fs from 'fs'
import { pipeline } from '@xenova/transformers'
import glob from 'fast-glob'
import { DB_PATH, MODEL, SHA, WORKSPACE } from './config'
import type { Data } from './types'
import { bulkInsert, db, migrate } from './sql'
import { EXCLUDE, INCLUDE } from './args'

console.log({ SHA, WORKSPACE, INCLUDE, EXCLUDE, DB_PATH })
//
migrate()
//
const entries = await glob(INCLUDE, {
	dot: true,
	onlyFiles: true,
	followSymbolicLinks: false,
	ignore: EXCLUDE
})

console.log(`${entries.length} matched files`)
const embedder = await pipeline('feature-extraction', MODEL)

const embeddings: Data[] = []
let iter = 0
for (const entry of entries) {
	iter++
	console.log(`embedding: ${entry}`)
	try {
		const buffer = fs.readFileSync(entry)
		const content = buffer.toString('utf-8')
		if (!content.length) {
			console.warn(`skipping empty content: ${entry}`)
			continue
		}
		const embed = await embedder(content, { pooling: 'mean' })
		const vector: number[] = Array.from(embed.data)
		embeddings.push({ path: entry, content, vector })
		if (embeddings.length === 100 || iter >= entries.length) {
			bulkInsert(embeddings)
			// clear
			embeddings.length = 0
		}
	} catch (error) {
		console.warn(`error processing: ${entry}: ${error}`)
	}
}

db.close(false)
