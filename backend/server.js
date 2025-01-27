const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8080', // Permitir conexões do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080', // Endereço do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Rota raiz
app.get('/', (req, res) => {
  res.send('Servidor rodando. Use as rotas /api/auth e /api/trainings.');
});

// Rotas
const authRoutes = require('./routes/authRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/trainings', trainingRoutes);

// Socket.IO para treinos compartilhados
io.on('connection', (socket) => {
  console.log('Novo cliente conectado.');

  socket.on('shareTraining', async (training) => {
    try {
      const newTraining = new Training(training);
      await newTraining.save();

      io.emit('newSharedTraining', newTraining);
    } catch (error) {
      console.error('Erro ao compartilhar treino:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado.');
  });
});

// Logout e gerenciamento de tokens revogados
const revokedTokens = new Set();

app.post('/api/auth/logout', (req, res) => {
  const token = req.header('Authorization');
  if (token) {
    revokedTokens.add(token); // Revogar o token
    res.status(200).json({ message: 'Logout realizado com sucesso.' });
  } else {
    res.status(400).json({ message: 'Token não fornecido.' });
  }
});

// Middleware para verificar tokens revogados
app.use((req, res, next) => {
  const token = req.header('Authorization');
  if (revokedTokens.has(token)) {
    return res.status(401).json({ message: 'Token revogado.' });
  }
  next();
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`));
