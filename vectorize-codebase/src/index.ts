import { run } from './action'
import { log } from './logger'

await run().catch(log.error)
