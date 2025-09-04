export const TABLES = {
  LISTS: {
    sql: `
      CREATE TABLE IF NOT EXISTS lists (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT,
        items INTEGER
      );
    `,
    columns: ['id', 'name', 'color', 'items'] as const,
  },
  PRODUCTS: {
    sql: `
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        listId TEXT NOT NULL,
        name TEXT NOT NULL,
        quantity TEXT,
        checked INTEGER DEFAULT 0
      );
    `,
    columns: ['id', 'listId', 'name', 'quantity', 'checked'] as const,
  },
  SETTINGS: {
    sql: `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `,
    columns: ['key', 'value'] as const,
  },
}
