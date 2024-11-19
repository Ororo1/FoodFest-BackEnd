const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ['vendor', 'foodfest-er'], required: true },
  attendance: { type: [String], enum: ['alone', 'plus-one', 'kids'], required: true },
  kidsCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
