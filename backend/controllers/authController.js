//controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registar novo utilizador
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validar os campos obrigatórios
    if (!username || !email || !password) {
      console.log('Campos ausentes:', { username, email, password });
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Formato de e-mail inválido:', email);
      return res.status(400).json({ message: 'Formato de e-mail inválido.' });
    }

    // Verificar se o e-mail já existe no banco de dados
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email já foi cadastrado:', email);
      return res.status(400).json({ message: 'Email já está em uso.' });
    }

    // Criptografar a palavra-passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o utilizador
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    console.log('Utilizador registado com sucesso:', username);
    res.status(201).json({ message: 'Utilizador registado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registar o utilizador:', error);

    // Verificar se é erro relacionado ao MongoDB (ex.: validação)
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Erro de validação.', errors });
    }

    // Caso contrário, erro interno do servidor
    res.status(500).json({ message: 'Erro interno ao registar o utilizador.' });
  }
};


// Login de utilizador
exports.login = async (req, res) => {
  console.log('Requisição recebida no /login:', req.body);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Utilizador não encontrado');
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Palavra-passe inválida');
      return res.status(401).json({ message: 'Palavra-passe inválida.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token criado:', token);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};


exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao obter o perfil do utilizador' });
  }
};

