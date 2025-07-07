
import { parseArgs, type ParseArgsOptionsConfig } from 'util'

export enum InputType {
	FLAG,
	ENV
}

export interface InputSchema {
	input: InputType
	type: 'string' | 'boolean' | 'number'
	default: string | boolean | number
}

export function inputs<T>(schema: Record<string, InputSchema>): T {
	const entries = Object.entries(schema)
	const flags: ParseArgsOptionsConfig = {}
	const envs: Record<string, string | boolean | number> = {}
	for (const [key, value] of entries) {
		if (value.input === InputType.FLAG) {
			flags[key] = {
				type: value.type === 'number' ? 'string' : value.type,
				default: value.type === 'number' ? value.default.toString() : value.default as 'string' | 'boolean',
			}
			continue
		}
		if (value.input === InputType.ENV) {
			const exists = process.env[key.toUpperCase()]
			if (exists) {
				if (value.type === 'boolean') {
					envs[key] = exists == 'true' ? true : false
				} else if (value.type === 'number') {
					envs[key] = parseInt(exists)
				}
				else {
					envs[key] = exists
				}
				continue
			}
			envs[key] = value.default
		}
	}

	let flagArgs: Record<string, string | boolean> | null = null
	if (Object.keys(flags).length) {
		const args = parseArgs({
			args: Bun.argv,
			options: flags,
			strict: true,
			allowPositionals: true,
		})
		flagArgs = args.values as Record<string, string | boolean> | null
	}
	return {
		...flagArgs,
		...envs
	} as T
}

const schema: Record<string, InputSchema> = {
	name: {
		input: InputType.FLAG,
		type: 'string',
		default: 'jude'
	},
	tee_hee: {
		input: InputType.FLAG,
		type: 'boolean',
		default: false
	},
	enabled: {
		input: InputType.ENV,
		type: 'boolean',
		default: false
	},
	age: {
		input: InputType.ENV,
		type: 'number',
		default: 23
	},
	num: {
		input: InputType.FLAG,
		type: 'number',
		default: 23
	},
}

type Vars = {
	name: string
	tee_hee: boolean
	enabled: boolean
}

const vars = inputs<Vars>(schema)
console.log({ vars })
