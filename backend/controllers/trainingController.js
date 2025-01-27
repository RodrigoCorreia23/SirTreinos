const Training = require('../models/Training');

// Criar um novo treino
exports.createTraining = async (req, res) => {
  try {
    const { name, location, date, type, duration, distance, satisfaction } = req.body;

    const training = new Training({
      name,
      location,
      date: new Date(date),
      type,
      duration,
      distance,
      satisfaction,
      createdBy: req.user.id,
    });

    await training.save();
    res.status(201).json(training);
  } catch (error) {
    console.error('Erro ao criar treino:', error);
    res.status(500).json({ message: 'Erro ao criar treino.' });
  }
};

// Obter todos os treinos
exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find()
      .sort({ date: -1 })
      .populate('createdBy', 'username email'); // Inclui dados do utilizador
    res.status(200).json(trainings);
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    res.status(500).json({ message: 'Erro ao buscar treinos.' });
  }
};


exports.getTrainingsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // Obtém o ID do utilizador autenticado
    const trainings = await Training.find({ createdBy: userId }).sort({ date: -1 });

    res.status(200).json(trainings);
  } catch (error) {
    console.error('Erro ao buscar treinos do utilizador:', error);
    res.status(500).json({ message: 'Erro ao buscar treinos do utilizador.' });
  }
};