import { Database, type Statement } from 'bun:sqlite'
import { DB_PATH, SHA, TABLE_NAME } from './config'
import type { Data } from './types'
import { log } from './logger'

export const db = new Database(DB_PATH, { create: true, readwrite: true, strict: true })

let insertMany: Statement

export function migrate() {
	const sql = `
		CREATE TABLE IF NOT EXISTS "${TABLE_NAME}" (
		"id" INTEGER PRIMARY KEY AUTOINCREMENT,
		"sha" TEXT NOT NULL,
		"file" TEXT NOT NULL,
		"path" TEXT NOT NULL,
		"content" TEXT NOT NULL,
		"vector" JSONB NOT NULL,
		"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
	`
	db.run(sql)
	insertMany = db.prepare(`INSERT INTO ${TABLE_NAME} (
		sha,
		file,
		path,
		content,
		vector
	) VALUES (
		:sha,
		:file,
		:path,
		:content,
		:vector
	)`)
}

export function bulkInsert(embeddings: Data[]) {
	const insert = db.transaction((values) => {
		for (const value of values) insertMany.run(value)
		return values.length
	})
	const values = embeddings.map(({ file, path, content, vector }) => ({
		sha: SHA,
		file,
		path,
		content,
		vector: JSON.stringify(vector),
	}))
	const inserted = insert(values)
	log.debug({ inserted })
}
