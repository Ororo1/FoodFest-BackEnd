const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// POST route to register user
router.post('/', async (req, res) => {
  const { name, email, phone, role, attendance, kidsCount } = req.body;

  if (!name || !email || !role || !attendance) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create new registration
    const registration = new Registration({ name, email, phone, role, attendance, kidsCount });
    await registration.save();

    res.status(201).json({ message: 'Registration successful', registration });
  } catch (error) {
    res.status(500).json({ message: 'Error saving registration', error });
  }
});

module.exports = router;
