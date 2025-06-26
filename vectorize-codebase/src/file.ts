import { readFileSync } from 'fs'
import { basename } from 'path'

export function parseContent(path: string) {
	const content = readFileSync(path).toString('utf-8')
	const file = basename(path)
	console.log(`processing: ${file}`)
	if (!content.length) {
		console.warn(`skipping empty content: ${file}`)
		return
	}
	return { file, content, path }
}
