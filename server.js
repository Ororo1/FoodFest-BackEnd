const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

// MongoDB Store for Sessions
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});

store.on('error', (error) => {
  console.error('Session store error:', error);
});

app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: 'your-session-secret', // Replace with a secure secret
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
  })
);

// Example User Schema
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String
}));

// Registration Route
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const newUser = new User({ name, email, password });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully.' });
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // Save user ID in session
  req.session.userId = user._id;

  res.json({
    message: 'Login successful.',
    user: { name: user.name, email: user.email }
  });
});

// Logout Route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful.' });
  });
});

// Middleware to Check Login Status
app.get('/api/check-auth', (req, res) => {
  if (req.session.userId) {
    return res.json({ authenticated: true });
  }
  res.json({ authenticated: false });
});

// Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
  .catch((err) => console.error(err));
