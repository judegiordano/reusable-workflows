import { Database, type Statement } from 'bun:sqlite'
import { logger } from '@reusable-workflows/logger'
import { DB_PATH, REPO_NAME, SHA, TABLE_NAME } from './args'
import type { Data } from './types'

export const db = new Database(DB_PATH, { create: true, readwrite: true, strict: true })

let insertMany: Statement

export function migrate() {
	const sql = `
		CREATE TABLE IF NOT EXISTS "${TABLE_NAME}" (
		"id" TEXT PRIMARY KEY,
		"sha" TEXT NOT NULL,
		"repository" TEXT NOT NULL,
		"file" TEXT NOT NULL,
		"path" TEXT NOT NULL,
		"content" TEXT NOT NULL,
		"vector" JSONB NOT NULL,
		"tokens" JSONB NOT NULL,
		"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
	`
	db.run(sql)
	insertMany = db.prepare(`INSERT INTO ${TABLE_NAME} (
		id,
		sha,
		repository,
		file,
		path,
		content,
		vector,
		tokens
	) VALUES (
		:id,
		:sha,
		:repository,
		:file,
		:path,
		:content,
		:vector,
		:tokens
	)`)
}

export function bulkInsert(embeddings: Data[]) {
	const insert = db.transaction((values) => {
		for (const value of values) insertMany.run(value)
		return values.length
	})
	const values = embeddings.map(({ file, path, content, vector, tokens }) => ({
		id: crypto.randomUUID(),
		sha: SHA,
		repository: REPO_NAME,
		file,
		path,
		content,
		vector: JSON.stringify(vector),
		tokens: JSON.stringify(tokens),
	}))
	const inserted = insert(values)
	logger.debug({ inserted })
}
