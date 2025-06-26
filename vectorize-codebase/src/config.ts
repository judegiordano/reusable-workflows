import path from 'path'

export const TABLE_NAME = 'code_files'
export const WORKSPACE = process.env.GITHUB_WORKSPACE ?? ''
export const SHA = process.env.GITHUB_SHA as string
export const DB_PATH = path.join(WORKSPACE, `${SHA}.sqlite`)
export const BULK_WRITE_CHUNK = 100

export const MODEL = 'Xenova/all-MiniLM-L6-v2'
