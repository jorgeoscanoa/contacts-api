const express    = require('express');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const Usuario    = require('../models/User');
const enrutador  = express.Router();

/**
 * POST /auth/register
 * Crea un usuario nuevo con password hasheada.
 */
enrutador.post('/register', async (req, res) => {
  try {
    //  Extraer datos del body
    const { email, password, role } = req.body;

    //  Generar salt y hash
    const salt     = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    //  Crear el usuario
    const usuarioNuevo = await Usuario.create({
      email,
      password: hashPass,
      role
    });

    // Responder sin exponer el hash
    res.status(201).json({ id: usuarioNuevo._id, email: usuarioNuevo.email, role: usuarioNuevo.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /auth/login
 * Verifica credenciales y emite un JWT.
 */
enrutador.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    //  Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

    //  Comparar passwords
    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) return res.status(401).json({ error: 'Credenciales inválidas' });

    //  Generar token
    const payload = { sub: usuario._id, role: usuario.role };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    // 4 Devolver token
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


module.exports = enrutador;