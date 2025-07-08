import path from 'path'
import { parseArgs } from 'util'

const { values } = parseArgs({
	args: Bun.argv,
	options: {
		include: {
			type: 'string',
			default: '**/*'
		},
		exclude: {
			type: 'string',
			default: '.git'
		},
	},
	strict: true,
	allowPositionals: true,
})

export const TABLE_NAME = 'code_files'
export const WORKSPACE = process.env.GITHUB_WORKSPACE ?? ''
export const SHA = process.env.GITHUB_SHA as string
export const REPO_NAME = process.env.GITHUB_REPOSITORY as string
export const DB_PATH = path.join(WORKSPACE, `${SHA}.sqlite`)
export const BULK_WRITE_CHUNK = 100

export const MODEL = 'Xenova/all-MiniLM-L6-v2'

export const EXCLUDE = values.exclude.split(',')
// prepend workspace to only include this project's directory
export const INCLUDE = values.include.split(',').map((e) => path.join(WORKSPACE, e))

