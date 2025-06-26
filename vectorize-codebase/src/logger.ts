const format = (...logs: unknown[]) => logs.map(l => typeof l === 'string' ? l : JSON.stringify(l)).join(' ')

export const log = {
	debug: (...logs: unknown[]) => {
		const now = new Date().toISOString()
		console.debug(`::debug::[${now}] ${format(logs)}`)
	},
	warn: (...logs: unknown[]) => {
		const now = new Date().toISOString()
		console.warn(`::warning::[${now}] ${format(logs)}`)
	},
	info: (...logs: unknown[]) => {
		const now = new Date().toISOString()
		console.log(`[${now}] ${format(logs)}`)
	},
	error: (...logs: unknown[]) => {
		const now = new Date().toISOString()
		console.debug(`::error::[${now}] ${format(logs)}`)
	}
}
