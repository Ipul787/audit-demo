const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

const secretKey = 'ae39fe0e33ae9ce46fbc22112a0d6d2b33cbc6df047f32343d6957e024e8f16b';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_react'
});

app.post('/register', (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).send('All fields are required');
  }
  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = 'INSERT INTO user (email, username, password) VALUES (?, ?, ?)';
  db.query(sql, [email, username, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting user into database:', err);
      return res.status(500).send('Server error');
    }
    res.status(201).send('User registered');
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Received credentials:', { username, password });

  db.query('SELECT * FROM user WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      console.log('No user found with username:', username);
      return res.status(401).send('Invalid credentials');
    }

    const user = results[0];
    console.log('Fetched user:', user);

    if (user) {
      const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '24h' });
      console.log('Generated token: ', token);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected data accessed successfully' });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');

    const token = bearer[1];

    if (!token) {
      console.error('No token exist');
      return res.sendStatus(401);
    }

    req.token = token;

    jwt.verify(req.token, secretKey, (err, authData) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.sendStatus(403);
      } else {
        req.user = authData;
        next();
      }
    });
  } else {
    console.error('No authorization header provided');
    res.sendStatus(401);
  }
}

app.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 8);

  const sql = 'UPDATE user SET password = ? WHERE email = ?';
  db.query(sql, [hashedPassword, email], (err, result) => {
    if (err) return res.status(500).send('Server error');
    res.status(200).send('Password reset successfully');
  });
});

app.get('/api/user', verifyToken, (req, res) => {
  const userId = req.user.username;

  const sql = 'SELECT email, username FROM user WHERE username = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Error fetching user data');
    } else if (result.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.json(result[0]);
    }
  });
});

app.post('/submitData', (req, res) => {
  const { title, area, startDate, endDate, username } = req.body;

  const sql = `INSERT INTO audit (title, area, start_date, end_date, user) VALUES (?, ?, ?, ?, ?)`;
  const values = [title, area, startDate, endDate, username];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Failed to submit data to database.' });
      return;
    }

    console.log('Data inserted successfully:', results);
    res.status(200).json({ message: 'Data submitted successfully!' });
  });
});

app.get('/audit', (req, res) => {
  let sql = 'SELECT audit.audit_id, audit.title, area.area, audit.start_date, audit.end_date, audit.user FROM audit JOIN area ON area.area_id = audit.area;';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});