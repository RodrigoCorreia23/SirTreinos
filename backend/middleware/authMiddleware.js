//middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const revokedTokens = require('../revokedTokens'); // Importa a lista de tokens revogados

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  if (revokedTokens.has(token)) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};
