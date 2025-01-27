//routes/trainingRoutes.js
const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para criar um treino (requer autenticação)
router.post('/', authMiddleware, trainingController.createTraining);

// Rota para obter todos os treinos
router.get('/my-trainings', authMiddleware, trainingController.getTrainingsByUser);
router.get('/', trainingController.getAllTrainings);

module.exports = router;
