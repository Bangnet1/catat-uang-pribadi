import { localDateKey } from '@/components/format';
import type { SQLiteDatabase } from 'expo-sqlite';

export type TransactionType = 'income' | 'expense';
export type Transaction = {
  id: number;
  type: TransactionType;
  amount: number;
  category: string;
  note: string | null;
  transaction_date: string;
  created_at: string;
};

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      amount INTEGER NOT NULL CHECK(amount > 0),
      category TEXT NOT NULL,
      note TEXT,
      transaction_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
  `);
}

export async function addTransaction(
  db: SQLiteDatabase,
  input: Omit<Transaction, 'id' | 'created_at'>
) {
  await db.runAsync(
    'INSERT INTO transactions (type, amount, category, note, transaction_date) VALUES (?, ?, ?, ?, ?)',
    input.type, input.amount, input.category, input.note, input.transaction_date
  );
}

export async function getRecentTransactions(db: SQLiteDatabase, limit = 8) {
  return db.getAllAsync<Transaction>(
    'SELECT * FROM transactions ORDER BY transaction_date DESC, id DESC LIMIT ?', limit
  );
}

export async function getMonthSummary(db: SQLiteDatabase) {
  const month = localDateKey().slice(0, 7);
  const row = await db.getFirstAsync<{ income: number; expense: number }>(
    `SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
     FROM transactions WHERE substr(transaction_date, 1, 7) = ?`, month
  );
  return { income: row?.income ?? 0, expense: row?.expense ?? 0 };
}