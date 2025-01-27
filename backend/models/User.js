//models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'O nome de utilizador é obrigatório.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório.'],
    unique: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Por favor, insira um endereço de e-mail válido.',
    ],
  },
  password: {
    type: String,
    required: [true, 'A palavra-passe é obrigatória.'],
    minlength: [6, 'A palavra-passe deve ter pelo menos 6 caracteres.'],
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

