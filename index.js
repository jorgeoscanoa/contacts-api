// Carga variables de entorno desde .env antes de usarla
// Cargame las variables de .env MONGO_URI PUERTO
require('dotenv').config();
// Importamos Express para crear el servidor HTTP
const express = require('express');
// Importamos Mongoose para conectar a MongoDB
const mongoose = require('mongoose');

// Creamos la instancia del servidor
const servidor = express();

// Parseamos las peticiones en formato Json
servidor.use(express.json());

// Conexion a MongoDB atlas usando la URI de env.
// URI - Uniform Resource Identifier(Identificador uniforme de recursos)
// Similar a un URL pero es mas general, indica donde encontrar ese recurso.
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB Atlas =)'))
    .catch(err => console.error('Error al conectar:', err));

// Motamos las rutas (GET/POST)    
const rutasContactos = require('./routes/contactos');
servidor.use('/api/contactos', rutasContactos)


    // Arrancamos el servidor en el puerto definido en .env o 3000
const puerto = process.env.PUERTO || 3000;
servidor.listen(puerto, ()=> {
    console.log(`Servidor corriendo en el puerto ${puerto}`);
});