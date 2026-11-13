---
name: data-persistence-layer
description: Store and read app data with a SQLite database, IndexedDB persistence and a repository layer in this repository. Use when the user asks for a database, persistence, saving data between sessions, storage, or tables and queries.
license: MIT
---

# The data layer

This repository stores app data in SQLite through `sql.js`, keeps the database file in
IndexedDB, and reaches the data through repositories. The pattern comes from
`voice-notes-app/src/db/`.

## The three layers

| Layer | Folder | What it does |
|---|---|---|
| Connection | `src/db/database.ts` | Opens the database, loads and saves it |
| Schema | `src/db/migrations.ts` | Holds the tables and the migrations |
| Repositories | `src/db/repositories/` | One file per table, with the queries |

A component never writes a query. It calls a repository, and the repository calls the
database.

## The schema

One file holds the whole schema. Every table uses `IF NOT EXISTS` so the schema can run on
every start.

```ts
import type { Database } from 'sql.js';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'blue'
);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
`;

export function runMigrations(db: Database): void {
  db.run('PRAGMA foreign_keys = ON;');
  db.run(SCHEMA);
}
```

## The connection

The database is a byte array in IndexedDB. `initDatabase` loads it, and `saveToIndexedDB`
writes it back.

```ts
import initSqlJs, { Database } from 'sql.js';
import { runMigrations } from './migrations';

const DB_NAME = 'ExpenseTracker_db';
const DB_STORE = 'databases';
const DB_KEY = 'main';

export async function initDatabase(): Promise<Database> {
  const SQL = await initSqlJs({ locateFile: (file: string) => `/${file}` });
  const savedData = await loadFromIndexedDB();

  if (savedData) {
    return new SQL.Database(savedData);
  }
  const db = new SQL.Database();
  runMigrations(db);
  await saveToIndexedDB(db);
  return db;
}
```

## A repository

A repository exposes named functions. It never returns a raw row: it maps the row to a
type.

```ts
import type { Database } from 'sql.js';
import { saveToIndexedDB } from '../database';
import type { Item } from '../../types';

function rowToItem(row: (string | number | null | Uint8Array)[]): Item {
  return {
    id: row[0] as number,
    title: row[1] as string,
    amount: row[2] as number,
    created_at: row[3] as string,
  };
}

export function getAll(db: Database): Item[] {
  const result = db.exec(
    'SELECT id, title, amount, created_at FROM items ORDER BY created_at DESC',
  );
  if (result.length === 0) return [];
  return result[0].values.map(rowToItem);
}

export function create(db: Database, title: string, amount: number): Item {
  db.run('INSERT INTO items (title, amount) VALUES (?, ?)', [title, amount]);
  saveToIndexedDB(db);

  const result = db.exec('SELECT last_insert_rowid() as id');
  const id = result[0].values[0][0] as number;
  return getById(db, id)!;
}
```

## Rules

- Always use a placeholder (`?`) for a value. Never build a query with string
  concatenation, because that is how SQL injection happens.
- Save to IndexedDB after every write. A write that is not saved is lost on reload.
- Map every row to a type before it leaves the repository.
- A query that returns nothing returns an empty array or `null`, never a partial row.
- Turn on foreign keys with `PRAGMA foreign_keys = ON;`, or the references do nothing.

## Reading the data in a component

The provider holds the database. A repository call goes through it.

```tsx
const { db } = useDatabase();

useEffect(() => {
  if (!db) return;
  setItems(getAll(db));
}, [db]);
```

## Related

- `react-state-context` for the provider that holds the database.
- `spec-driven-feature` for the behaviour these tables serve.
