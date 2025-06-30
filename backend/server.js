const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./database');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '5mb' }));

const allowedOrigins = ['https://speedmail.vercel.app', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/profile_pics', express.static(path.join(__dirname, 'profile_pics')));

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
    'INSERT INTO users (email, username_encrypted, password_hashed, Admin_access) VALUES (?, ?, ?, ?)',
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
    const isAdmin = Number(row.Admin_access) === 1;
    const token = jwt.sign({ email, isAdmin }, JWT_SECRET, { expiresIn: '2h' });

    console.log('User logged in successfully');
    res.json({ success: true, username, token });
  });
});


app.post('/send', authenticateToken, (req, res) => {
    const { receiver, subject, content } = req.body;
    if (!receiver || !content) {
        return res.status(400).json({ message: 'Receiver and content are required' });
    }
    const sender = req.user.email;
    const date = formatDate(new Date());
    const subjectEncrypted = encrypt(subject || '(No Subject)');
    const contentEncrypted = encrypt(content);
    
    db.run(
        'INSERT INTO emails (sender, receiver, subject, content, date, is_draft) VALUES (?, ?, ?, ?, ?, 0)',
        [sender, receiver, subjectEncrypted, contentEncrypted, date],
        function(err) {
            if (err) {
                console.log('Error sending email:', err);
                return res.status(500).json({ message: 'Failed to send email' });
            }
            res.json({ success: true, emailId: this.lastID });
        }
    );
});


app.post('/drafts', authenticateToken, (req, res) => {
    const { receiver, subject, content } = req.body;
    const sender = req.user.email;
    const date = formatDate(new Date());
    const subjectEncrypted = encrypt(subject || '(No Subject)');
    const contentEncrypted = encrypt(content || '');
    db.run(
        'INSERT INTO emails (sender, receiver, subject, content, date, is_draft) VALUES (?, ?, ?, ?, ?, 1)',
        [sender, receiver, subjectEncrypted, contentEncrypted, date],
        function(err) {
            if (err) {
                console.log('Error saving draft:', err);
                return res.status(500).json({ message: 'Failed to save draft' });
            }
            res.json({ success: true, draftId: this.lastID });
        }
    );
});

app.put('/drafts/:id', authenticateToken, (req, res) => {
    const { receiver, subject, content } = req.body;
    const draftId = req.params.id;
    const email = req.user.email;
    const subjectEncrypted = encrypt(subject || '(No Subject)');
    const contentEncrypted = encrypt(content || '');
    db.run(
        'UPDATE emails SET receiver = ?, subject = ?, content = ?, date = ?, is_draft = 1 WHERE id = ? AND sender = ? AND is_draft = 1',
        [receiver, subjectEncrypted, contentEncrypted, new Date().toISOString(), draftId, email],
        function(err) {
            if (err) {
                console.log('Error updating draft:', err);
                return res.status(500).json({ message: 'Failed to update draft' });
            }
            res.json({ success: true });
        }
    );
});

app.delete('/drafts/:id', authenticateToken, (req, res) => {
    const draftId = req.params.id;
    const email = req.user.email;
    db.run(
        'DELETE FROM emails WHERE id = ? AND sender = ? AND is_draft = 1',
        [draftId, email],
        function(err) {
            if (err) {
                console.log('Error deleting draft:', err);
                return res.status(500).json({ message: 'Failed to delete draft' });
            }
            res.json({ success: true });
        }
    );
});

app.get('/drafts', authenticateToken, (req, res) => {
    const email = req.user.email;
    db.all(
        'SELECT * FROM emails WHERE sender = ? AND is_draft = 1 ORDER BY date DESC',
        [email],
        (err, rows) => {
            if (err) {
                console.log('Error retrieving drafts:', err);
                return res.status(500).json({ message: 'Failed to retrieve drafts' });
            }
            const decryptedRows = rows.map(row => ({
                ...row,
                subject: decrypt(row.subject),
                content: decrypt(row.content)
            }));
            res.json({ success: true, drafts: decryptedRows });
        }
    );
});

app.get('/account', authenticateToken, (req, res) => {
  const email = req.user.email;
  db.get('SELECT email, username_encrypted FROM users WHERE email = ?', [email], (err, row) => {
    if (err || !row) return res.status(400).json({ message: 'User not found' });
    const username = decrypt(row.username_encrypted);
    res.json({ email, username });
  });
});

app.put('/account', authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { newUsername, newPassword, profilePic } = req.body;
  const updates = [];
  const params = [];
  if (newUsername) {
    updates.push('username_encrypted = ?');
    params.push(encrypt(newUsername));
  }
  if (newPassword) {
    const hash = await bcrypt.hash(newPassword, 10);
    updates.push('password_hashed = ?');
    params.push(hash);
  }
  if (updates.length) {
    params.push(email);
    db.run(`UPDATE users SET ${updates.join(', ')} WHERE email = ?`, params, err => {
      if (err) return res.status(500).json({ message: 'Failed to update user' });
    });
  }
  if (profilePic) {
    try {
      const buffer = Buffer.from(profilePic, 'base64');
      fs.writeFileSync(path.join(__dirname, 'profile_pics', `${email}.png`), buffer);
    } catch (e) {
      return res.status(500).json({ message: 'Failed to save profile picture' });
    }
  }
  res.json({ success: true });
});

app.get('/emails', authenticateToken, (req, res) => {
    const userEmail = req.user.email;
    db.all(
        'SELECT * FROM emails WHERE (receiver = ? OR sender = ?) AND is_draft = 0 ORDER BY date DESC',
        [userEmail, userEmail],
        (err, rows) => {
            if (err) {
                console.log('Error retrieving emails:', err);
                return res.status(500).json({ message: 'Failed to retrieve emails' });
            }
            const decryptedRows = rows.map(row => ({
                ...row,
                subject: decrypt(row.subject),
                content: decrypt(row.content)
            }));
            res.json({ success: true, emails: decryptedRows });
        }
    );
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

function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

app.get('/users', authenticateToken, requireAdmin, (req, res) => {
  console.log('GET /users request by', req.user.email);
  db.all('SELECT email, username_encrypted, Admin_access FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch users' });
    const users = rows.map(r => ({
      email: r.email,
      username: decrypt(r.username_encrypted),
      isAdmin: !!r.Admin_access
    }));
    res.json({ success: true, users });
  });
});

app.put('/users/:email', authenticateToken, requireAdmin, async (req, res) => {
  const target = req.params.email;
  const { username, password, isAdmin, profilePic } = req.body;
  const updates = [];
  const params = [];

  if (username) { updates.push('username_encrypted = ?'); params.push(encrypt(username)); }
  if (password) { updates.push('password_hashed = ?'); params.push(await bcrypt.hash(password, 10)); }
  if (typeof isAdmin !== 'undefined') { updates.push('Admin_access = ?'); params.push(isAdmin ? 1 : 0); }

  if (updates.length) {
    params.push(target);
    db.run(`UPDATE users SET ${updates.join(', ')} WHERE email = ?`, params, err => {
      if (err) return res.status(500).json({ message: 'Failed to update user' });
    });
  }

  if (profilePic) {
    try {
      fs.writeFileSync(path.join(__dirname, 'profile_pics', `${target}.png`), Buffer.from(profilePic, 'base64'));
    } catch { return res.status(500).json({ message: 'Failed to save picture' }); }
  }
  res.json({ success: true });
});

app.delete('/users/:email', authenticateToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM users WHERE email = ?', [req.params.email], err => {
    if (err) return res.status(500).json({ message: 'Failed to delete user' });
    res.json({ success: true });
  });
});

const ENCRYPTION_KEY = Buffer.from('0123456789abcdef0123456789abcdef', 'utf8');
const IV_LENGTH = 16;
function formatDate(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}` +
    ` - ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}


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

app.use((_req, res) => {
  res.send('Porsche API is running at full speed 🚗💨');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));