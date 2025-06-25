import { Database } from 'bun:sqlite'
import { DB_PATH } from './config'

export const db = new Database(DB_PATH, { create: true, readwrite: true, strict: true })

const change = db.exec('PRAGMA journal_mode = WAL;')
console.log({ change })

export function migrate(table: string) {
	db.exec('PRAGMA journal_mode = WAL;')
	const sql = `
		CREATE TABLE IF NOT EXISTS "${table}"(
		"id" INTEGER PRIMARY KEY AUTOINCREMENT,
		"sha" TEXT NOT NULL,
		"path" TEXT NOT NULL,
		"vector" JSON NOT NULL,
		"updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		"created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
	`
	const dbChanges = db.run(sql)
	console.log({ dbChanges })
}
