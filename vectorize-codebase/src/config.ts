import path from 'path'
// import fs from 'fs'

export const TABLE_NAME = 'code_files'
export const WORKSPACE = process.env.GITHUB_WORKSPACE ?? ''
export const SHA = process.env.GITHUB_SHA as string
export const EXCLUDES = process.argv[2]?.split(',') ?? []
// prepend workspace to only include this project's directory
export const INCLUDES = (process.argv[3]?.split(',') ?? ['**/*']).map((entry) => path.join(WORKSPACE, entry))
export const DB_PATH = path.join(WORKSPACE, `${SHA}.sqlite`)

export const MODEL = 'Xenova/all-MiniLM-L6-v2'
