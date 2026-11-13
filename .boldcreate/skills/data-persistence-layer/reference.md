# The database of this repository

The apps store their data in SQLite through `sql.js`. The database lives in memory and is
written to IndexedDB as a byte array.

## The three layers

| Layer | File | What it holds |
|---|---|---|
| Connection | `src/db/database.ts` | Opening, loading and saving |
| Schema | `src/db/migrations.ts` | The tables |
| Repositories | `src/db/repositories/*.ts` | The queries, one file per table |

## The tables

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  is_pinned INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'yellow'
);

CREATE TABLE IF NOT EXISTS note_tags (
  note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

CREATE TABLE IF NOT EXISTS settings (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  theme TEXT DEFAULT 'light',
  font_size TEXT DEFAULT 'small'
);
```

## The rules of the schema

- Every table uses `IF NOT EXISTS`, so the schema runs on every start without failing.
- A boolean is an `INTEGER` of 0 or 1.
- A date is a `TEXT` holding `datetime('now')`.
- A reference carries `ON DELETE CASCADE`, so a deleted parent takes its children with it.
- A join table has a `PRIMARY KEY` of both columns, so the same pair cannot appear twice.

## The connection

```ts
const DB_NAME = 'SyncNotess_db';
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

The schema runs only when there is no saved database. A saved database already holds the
schema.

## Saving

Every write must be saved, or it is lost on reload.

```ts
export async function saveToIndexedDB(db: Database): Promise<void> {
  const data = db.export();
  const idb = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(DB_STORE, 'readwrite');
    const store = tx.objectStore(DB_STORE);
    const request = store.put(data, DB_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
```

## A repository

```ts
export function getAll(db: Database, userId: number): Note[] {
  const result = db.exec(
    'SELECT id, user_id, title, content, is_pinned, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
    [userId],
  );
  if (result.length === 0) return [];
  return result[0].values.map(rowToNote);
}
```

## The rules of a repository

- A value always goes in as a placeholder (`?`). Never build a query with string
  concatenation.
- A row is mapped to a type before it leaves the repository.
- A query that finds nothing returns an empty array or `null`.
- A write is followed by `saveToIndexedDB`.
- The repository holds the SQL. A component never sees a query.

## The row mapper

```ts
function rowToNote(row: (string | number | null | Uint8Array)[]): Note {
  return {
    id: row[0] as number,
    user_id: row[1] as number,
    title: row[2] as string,
    content: row[3] as string,
    is_pinned: row[4] as number,
    created_at: row[5] as string,
    updated_at: row[6] as string,
  };
}
```

The column order in the `SELECT` matches the order in the mapper. When a column is added,
both change together.

## The last id of an insert

`sql.js` has no returning clause, so the id is read in a second query.

```ts
db.run('INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)', [userId, title, content]);
saveToIndexedDB(db);

const result = db.exec('SELECT last_insert_rowid() as id');
const noteId = result[0].values[0][0] as number;
```
