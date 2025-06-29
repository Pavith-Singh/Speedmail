const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('encrypted_database_speedmail.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, username_encrypted TEXT NOT NULL, password_hashed TEXT NOT NULL, Admin_access NOT NULL DEFAULT 0)');
    db.run('CREATE TABLE IF NOT EXISTS emails (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT NOT NULL, receiver TEXT, subject TEXT, content TEXT, date TEXT, is_draft INTEGER DEFAULT 0)');
    db.run('ALTER TABLE emails ADD COLUMN is_draft INTEGER DEFAULT 0', () => {});
});

module.exports = db;