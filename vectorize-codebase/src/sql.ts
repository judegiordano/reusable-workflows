import { Database } from 'bun:sqlite'
import { DB_PATH, SHA, TABLE_NAME } from './config'
import type { Data } from './types'

export const db = new Database(DB_PATH, { create: true, readwrite: true, strict: true })

export function migrate() {
	db.exec('PRAGMA journal_mode = WAL;')
	const sql = `
		CREATE TABLE IF NOT EXISTS "${TABLE_NAME}"(
		"id" INTEGER PRIMARY KEY AUTOINCREMENT,
		"sha" TEXT NOT NULL,
		"path" TEXT NOT NULL,
		"content" TEXT NOT NULL,
		"vector" JSON NOT NULL,
		"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
	`
	db.run(sql)
}

export function bulkInsert(embeddings: Data[]) {
	const query = db.prepare(`INSERT INTO ${TABLE_NAME} (
		sha,
		path,
		content,
		vector
	) VALUES (
		:sha,
		:path,
		:content,
		:vector
	)`)
	const insertMany = db.transaction((values) => {
		for (const value of values) query.run(value)
		return values.length
	})
	const values = embeddings.map(({ path, content, vector }) => ({
		sha: SHA,
		path: path,
		content: content,
		vector: JSON.stringify(vector),
	}))
	const inserted = insertMany(values)
	console.log({ inserted })
}
