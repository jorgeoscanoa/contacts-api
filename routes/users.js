const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/users
// Devuelve todos los usuarios (solo admin)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const usuarios = await User.find().select('-password'); // excluye password
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

module.exports = router;
