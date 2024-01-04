const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();


const pool = require('./db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.json({ message: 'Hello World!' })
})

const server = http.createServer(app);
//const io = new Server(server);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


//Socket
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle chat messages
  socket.on('chat message', (message) => {
    // You can save the message to your PostgreSQL database here
    // Emit the message to all connected clients
    io.emit('chat message', message);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

//Socket

// Set up routes, handle user authentication, and connect to the database.
//Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query(
      'SELECT * FROM Users WHERE username = $1',
      [username]
    );
    if (user.rows.length === 0) {
      return res.status(401).json('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].hashed_password);

    if (!isPasswordValid) {
      return res.status(401).json('Invalid credentials');
    }
    
    const token = jwt.sign({ user: user.rows[0].user_id }, secretKey);      
    
    res.json({ token, username });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
  
});

// Register
app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if(!password) {
      return res.status(400).json({ error: 'Password is required' })
    }  

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(406).json({
      error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    });
  }
    
    // Check if the username already exists in the database
  const existingUser = await pool.query(
    'SELECT * FROM Users WHERE username = $1',
    [username]
  );
  
  if (existingUser.rows.length > 0) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(403).json({ error: 'Username taken' });
  }

  if (existingUser.rows.length > 0) {
    return res.status(403).json({ error: 'Username taken' });
  }

  // Check if the email already exists in the database
  const existingEmail = await pool.query(
    'SELECT * FROM Users WHERE email = $1',
    [email]
  );

  if (existingEmail.rows.length > 0) {
    console.log(existingEmail.rows)
    return res.status(405).json({ error: 'Email already in use' });
  }


  const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO Users (username, hashed_password, email) VALUES ($1, $2, $3)',
      [username, hashedPassword, email]
    );
    res.setHeader('Content-Type', 'application/json')
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});


app.listen(5000, () => {
  console.log('We up!')
})

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});