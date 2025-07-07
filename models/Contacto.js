const mongoose = require('mongoose');

//Definir el esquema para un contacto

const esquemaContacto = new mongoose.Schema({
    nombre: { type: String, require:true}, //Nombre sera obligatorio
    correo: { type: String, require:true}, // Correo obligatorio
    telefono: {type: String }, // Telefono opcional
    empresa:  { type: String } // Campo extra para el mini‑reto

});
// Exportamos el modelo con nombre 'Contacto'
module.exports = mongoose.model('Contacto', esquemaContacto);
