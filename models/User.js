const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
        email: { type : String, required: true, unique:true }, // correo unico
        password: { type: String, required: true}, // hash de bcrypt
        role: { type: String, enum:['user','admin'], default: 'user'} // rol
});

module.exports = mongoose.model('User', esquemaUsuario);