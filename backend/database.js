const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('encrypted_database_speedmail.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, username_encrypted TEXT NOT NULL, password_hashed TEXT NOT NULL, Admin_access NOT NULL DEFAULT 0)');
});

module.exports = db;