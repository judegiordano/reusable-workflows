import fs from 'fs'
import { pipeline } from '@xenova/transformers'
import glob from 'fast-glob'

import { DATA_PATH, EXCLUDES, INCLUDES, MODEL, WORKSPACE } from './config'
import type { Data } from './types'

console.log({ WORKSPACE, INCLUDES, EXCLUDES, DATA_PATH, ARGS: process.argv })
const entries = await glob(INCLUDES, {
	dot: true,
	onlyFiles: true,
	followSymbolicLinks: false,
	ignore: EXCLUDES
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
		if (!content.length) continue
		const embed = await embedder(content, { pooling: 'mean' })
		const vector: number[] = Array.from(embed.data)
		embeddings.push({ path: entry, content, vector })
		if (embeddings.length === 100 || iter >= entries.length) {
			fs.writeFileSync(`${DATA_PATH}/${Date.now()}.json`, JSON.stringify(embeddings))
			// clear
			embeddings.length = 0
		}
	} catch (error) {
		console.log(`error reading: ${entry}: ${error}`)
	}
}
