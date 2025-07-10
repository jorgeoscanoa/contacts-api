// Carga variables de entorno desde .env antes de usarla
// Cargame las variables de .env MONGO_URI PUERTO
require('dotenv').config();
// Importamos Express para crear el servidor HTTP
const express = require('express');
// Importamos Mongoose para conectar a MongoDB
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const User = require('./models/User');

// Creamos la instancia del servidor
const servidor = express()
// Parseamos las peticiones en formato Json
servidor.use(express.json());


const rutaAuth = require('./routes/auth');
servidor.use('/auth', rutaAuth);

// Conexion a MongoDB atlas usando la URI de env.
// URI - Uniform Resource Identifier(Identificador uniforme de recursos)
// Similar a un URL pero es mas general, indica donde encontrar ese recurso.
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Conectado a MongoDB Atlas =)');

    // Creamos un admin por defecto si no existe
    const existeAdmin = await User.findOne({ role: 'admin' });
    if (!existeAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

      const admin = await User.create({
        email:    process.env.ADMIN_EMAIL,
        password: hash,
        role:     'admin'
      });

      console.log('Admin por defecto creado:', admin.email);
    }
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  })
// Motamos las rutas (GET/POST)    
const rutasContactos = require('./routes/contactos');
servidor.use('/api/contactos', rutasContactos)

// Arrancamos el servidor en el puerto definido en .env o 3000

const puerto = process.env.PUERTO || 3000;
servidor.listen(puerto, ()=> {
    console.log(`Servidor corriendo en el puerto ${puerto}`);
});