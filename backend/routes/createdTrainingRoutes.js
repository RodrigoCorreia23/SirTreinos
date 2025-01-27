const express = require('express');
const router = express.Router();
const { createTraining, getAllTrainings } = require('../controllers/createdTrainingController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para criar novo treino
router.post('/', authMiddleware, createTraining);

// Rota para listar todos os treinos
router.get('/', getAllTrainings);

module.exports = router;
