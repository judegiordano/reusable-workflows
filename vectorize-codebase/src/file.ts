import { readFileSync } from 'fs'
import { basename } from 'path'

export function parseContent(path: string) {
	const content = readFileSync(path).toString('utf-8')
	const file = basename(path)
	return { file, content, path }
}
