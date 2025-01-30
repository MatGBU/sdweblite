const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for port

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());
app.use(cors({ origin: 'https://your-frontend-domain.com', credentials: true })); // Update origin
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } // HTTPS in production
}));

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (await User.findOne({ username })) {
      return res.status(400).json({ error: 'Username exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.json({ message: 'Registered!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.user = user;
    res.json({ message: 'Logged in!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve static files if needed (or host frontend separately)
app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));