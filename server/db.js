import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, 'odeshie.db');

let db;

export async function initDb() {
  const SQL = await initSqlJs();

  if (existsSync(DB_PATH)) {
    const fileBuffer = readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create schema
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      discount_percent INTEGER DEFAULT 0,
      category TEXT NOT NULL,
      is_new_arrival INTEGER DEFAULT 0,
      is_on_sale INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 100,
      colors TEXT DEFAULT '[]',
      sizes TEXT DEFAULT '[]',
      image_url TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      color TEXT,
      size TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_id INTEGER,
      rating INTEGER NOT NULL,
      comment TEXT,
      reviewer_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  persistDb();
  return db;
}

export function persistDb() {
  if (db) {
    const data = db.export();
    writeFileSync(DB_PATH, Buffer.from(data));
  }
}

// sql.js wrapper to match better-sqlite3-like sync API
class DbWrapper {
  prepare(sql) {
    return {
      run: (...params) => {
        const flatParams = params.length === 1 && typeof params[0] === 'object' && !Array.isArray(params[0])
          ? Object.values(params[0])
          : params.flat();
        db.run(sql, flatParams);
        // Get last insert rowid
        const rowid = db.exec('SELECT last_insert_rowid()');
        const lastInsertRowid = rowid[0]?.values[0]?.[0] ?? null;
        const changes = db.exec('SELECT changes()');
        const changesCount = changes[0]?.values[0]?.[0] ?? 0;
        persistDb();
        return { lastInsertRowid, changes: changesCount };
      },
      get: (...params) => {
        const flatParams = params.length === 1 && typeof params[0] === 'object' && !Array.isArray(params[0])
          ? Object.values(params[0])
          : params.flat();
        const result = db.exec(sql, flatParams);
        if (!result || result.length === 0 || result[0].values.length === 0) return undefined;
        const columns = result[0].columns;
        const row = result[0].values[0];
        return Object.fromEntries(columns.map((col, i) => [col, row[i]]));
      },
      all: (...params) => {
        const flatParams = params.length === 1 && typeof params[0] === 'object' && !Array.isArray(params[0])
          ? Object.values(params[0])
          : params.flat();
        const result = db.exec(sql, flatParams);
        if (!result || result.length === 0) return [];
        const columns = result[0].columns;
        return result[0].values.map(row =>
          Object.fromEntries(columns.map((col, i) => [col, row[i]]))
        );
      }
    };
  }

  exec(sql) {
    db.run(sql);
    persistDb();
  }

  transaction(fn) {
    return () => {
      db.run('BEGIN');
      try {
        fn();
        db.run('COMMIT');
        persistDb();
      } catch (err) {
        db.run('ROLLBACK');
        throw err;
      }
    };
  }
}

export default new DbWrapper();
