const express = require('express');
const Contacto = require('../models/Contacto');
const enrutador = express.Router();

// GET/api/contactos 
// **Devuelve todos los contactos**

// enrutador.get : Define una ruta GET en path raiz (/)
// async (req, res)=> Funcion asincronica 
// req (objeto de la solicitud request)
// res (objeto de respuesta respuesta)
enrutador.get('/', async (req, res)=> {
    try{
        const listaContactos = await Contacto.find();
        res.json(listaContactos);
    }catch (error){
        res.status(500).json({error: 'Error en el servidor'});
    }
});

// GET /api/contacto/:id
// Devuelve un contacto por ID
// GET / api / contactos/ 64aecef54d0a3b1bcf223456
// re.params.id obtine el valor del parámetro ':id' de la url
enrutador.get('/:id', async (req, res)=> {
    try{
        const contacto = await Contacto.findById(req.params.id);
        // Si no encuentra contacto / error 4004
        if(!contacto) return res.status(404).json({ error : 'Contacto no encontrado'});
        // Si lo encuentra me devuelve como json
        res.json(contacto);
    }catch (error){
        res.status(400).json({ error: 'ID invalido'});
    }
});

// POST /api/contactos
// Crea un nuevo contacto con los datos del body

enrutador.post('/', async (req,res)=> {
    try{
        const nuevoContacto = await Contacto.create(req.body);
        res.status(201).json(nuevoContacto);
    }catch{
        res.status(400).json({ error : error.message });
    }
});

module.exports = enrutador;