const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./database');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const JWT_SECRET = 'your_jwt_secret_key_here';

app.post('/register', async (req, res) => {
  console.log('Register request received');
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    console.log('Missing fields in register request');
    return res.status(400).json({ message: 'All fields are required' });
  }

  const usernameEncrypted = encrypt(username);
  const passwordHashed = await bcrypt.hash(password, 10);
  const isAdmin = email.endsWith('@porsche-corporate.com') || email.endsWith('@porsche-executive.com') ? 1 : 0;

  db.run(
    'INSERT INTO users (email, username_encrypted, password_hashed, admin_access) VALUES (?, ?, ?, ?)',
    [email, usernameEncrypted, passwordHashed, isAdmin],
    function (err) {
      if (err) {
        console.log('Error registering user:', err);
        return res.status(400).json({ message: 'User already exists' });
      }

      console.log('User registered successfully');
      const token = jwt.sign({ email, isAdmin }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ success: true, token });
    }
  );
});

app.post('/login', (req, res) => {
  console.log('Login request received');
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing fields in login request');
    return res.status(400).json({ message: 'Empty Fields' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err || !row) {
      console.log('Error logging in user:', err);
      return res.status(400).json({ message: 'Invalid Details' });
    }

    const valid = await bcrypt.compare(password, row.password_hashed);
    if (!valid) {
      console.log('Invalid login credentials');
      return res.status(400).json({ message: 'Invalid Details' });
    }

    const username = decrypt(row.username_encrypted);
    const isAdmin = row.admin_access === 1;
    const token = jwt.sign({ email, isAdmin }, JWT_SECRET, { expiresIn: '2h' });

    console.log('User logged in successfully');
    res.json({ success: true, username, token });
  });
});

// NEW: Endpoint to send an email
app.post('/send', authenticateToken, (req, res) => {
    const { receiver, subject, content } = req.body;
    if (!receiver || !content) {
        return res.status(400).json({ message: 'Receiver and content are required' });
    }
    const sender = req.user.email;
    const date = new Date().toISOString();
    db.run(
        'INSERT INTO emails (sender, receiver, subject, content, date) VALUES (?, ?, ?, ?, ?)',
        [sender, receiver, subject || '(No Subject)', content, date],
        function(err) {
            if (err) {
                console.log('Error sending email:', err);
                return res.status(500).json({ message: 'Failed to send email' });
            }
            res.json({ success: true, emailId: this.lastID });
        }
    );
});

// NEW: Endpoint to get emails for the authenticated user
app.get('/emails', authenticateToken, (req, res) => {
    const userEmail = req.user.email;
    db.all(
        'SELECT * FROM emails WHERE receiver = ? OR sender = ? ORDER BY date DESC',
        [userEmail, userEmail],
        (err, rows) => {
            if (err) {
                console.log('Error retrieving emails:', err);
                return res.status(500).json({ message: 'Failed to retrieve emails' });
            }
            res.json({ success: true, emails: rows });
        }
    );
});

app.use((_req, res) => {
  res.send('Porsche API is running at full speed 🚗💨');
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

const ENCRYPTION_KEY = Buffer.from('0123456789abcdef0123456789abcdef', 'utf8');
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const [ivHex, encrypted] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

app.listen(3000, () => console.log('Server running on http://localhost:3000'));