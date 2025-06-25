import path from 'path'
import fs from 'fs'

export const WORKSPACE = process.env.GITHUB_WORKSPACE ?? ''
export const SHA = process.env.GITHUB_SHA as string
export const EXCLUDES = process.argv[2]?.split(',') ?? []
// prepend workspace to only include this project's directory
export const INCLUDES = (process.argv[3]?.split(',') ?? ['**/*']).map((entry) => path.join(WORKSPACE, entry))
// write path
export const DATA_PATH = fs.mkdirSync(path.join(WORKSPACE, '.vector_data'), { recursive: true })

export const MODEL = 'Xenova/all-MiniLM-L6-v2'
