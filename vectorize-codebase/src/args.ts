import path from 'path'
import { parseArgs } from 'util'
import { WORKSPACE } from './config'

const { values } = parseArgs({
	args: Bun.argv,
	options: {
		'include-pattern': {
			type: 'string',
			default: '**/*'
		},
		'exclude-pattern': {
			type: 'string',
			default: '.git'
		},
	},
	strict: true,
	allowPositionals: true,
})

export const EXCLUDE = values['exclude-pattern'].split(',')
// prepend workspace to only include this project's directory
export const INCLUDE = values['include-pattern'].split(',').map((e) => path.join(WORKSPACE, e))
