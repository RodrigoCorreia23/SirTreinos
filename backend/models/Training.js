//models/Training.js
const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema({
  name: String,
  location: String,
  date: Date,
  type: String,
  duration: Number,
  distance: Number,
  satisfaction: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencia o modelo de usuário
    required: true,
  },
});

module.exports = mongoose.model('Training', TrainingSchema);
