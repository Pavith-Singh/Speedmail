const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./database');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));console.log('Server running on http://localhost:3000');
app.post('/register', async (req, res) => {
    console.log('Register request received');
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        console.log('Missing fields in register request');
        return res.status(400).json({ message: 'All fields are required' });
    }

    
    const usernameEncrypted = encrypt(username);
    const passwordHashed = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (email, username_encrypted, password_hashed) VALUES (?, ?, ?)',
        [email, usernameEncrypted, passwordHashed], function (err) {
            if (err) {
                console.log('Error registering user:', err);
                return res.status(400).json({ message: 'User already exists' });
            }
            console.log('User registered successfully');
            res.json({success: true});
        }
    );
});

app.post('/login', (req, res) => {
    console.log('Login request received');
    const {email, password} = req.body;
    if (!email || !password) {
        console.log('Missing fields in login request');
        return res.status(400).json({ message: 'Empty Fields' });
    }
    
    db.get('SELECT * FROM users WHERE email = ?', 
        [email], async (err, row) => {
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
            console.log('User logged in successfully');
            res.json({success: true, username});
        }
    );
});


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
