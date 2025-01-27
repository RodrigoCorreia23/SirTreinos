const CreatedTraining = require('../models/CreatedTraining');

// Criar novo treino
exports.createTraining = async (req, res) => {
  try {
    const { name, location, date, time, type } = req.body;
    const createdBy = req.user.id; // Usuário autenticado

    const newTraining = await CreatedTraining.create({
      name,
      location,
      date,
      time,
      type,
      createdBy,
    });

    res.status(201).json(newTraining);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar treino', error });
  }
};

// Listar todos os treinos
exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await CreatedTraining.find().populate('createdBy', 'username');
    res.status(200).json(trainings);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar treinos', error });
  }
};
