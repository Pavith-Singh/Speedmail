const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('encrypted_database_speedmail.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, username_encrypted TEXT, password_hashed TEXT)');
});

module.exports = db;