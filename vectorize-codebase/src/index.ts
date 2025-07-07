import { run } from './action'
import { logger } from '@reusable-workflows/logger'

await run().catch(logger.error)
