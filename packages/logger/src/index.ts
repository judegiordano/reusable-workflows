const format = (...logs: unknown[]) =>
	logs
		.map(l =>
			typeof l === 'string'
				? l
				: JSON.stringify(l, null, 2) // pretty print objects
		)
		.join(' ')

const color = {
	debug: '\x1b[36m',   // cyan
	warn: '\x1b[33m',    // yellow
	info: '\x1b[32m',    // green
	error: '\x1b[31m',   // red
	reset: '\x1b[0m'
}

export const logger = {
	debug: (...logs: unknown[]) => {
		const now = new Date().toISOString()
		console.debug(`${color.debug}[DEBUG ${now}]${color.reset} ${format(...logs)}`)
	},
	warn: (...logs: unknown[]) => {
		const now = new Date().toISOString()
		console.warn(`${color.warn}[WARN  ${now}]${color.reset} ${format(...logs)}`)
	},
	info: (...logs: unknown[]) => {
		const now = new Date().toISOString()
		console.log(`${color.info}[INFO  ${now}]${color.reset} ${format(...logs)}`)
	},
	error: (...logs: unknown[]) => {
		const now = new Date().toISOString()
		console.error(`${color.error}[ERROR ${now}]${color.reset} ${format(...logs)}`)
	}
}
