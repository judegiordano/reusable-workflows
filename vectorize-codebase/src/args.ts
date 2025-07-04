import path from 'path'
import { parseArgs } from 'util'
import { WORKSPACE } from './config'

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

export const EXCLUDE = values.exclude.split(',')
// prepend workspace to only include this project's directory
export const INCLUDE = values.include.split(',').map((e) => path.join(WORKSPACE, e))
