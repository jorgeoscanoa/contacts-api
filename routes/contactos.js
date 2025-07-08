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

// PUT  /api/contactos/:id
// Actualiza uno o varios campos de un  contacto existenten

enrutador.put('/:id', async (req,res)=>{
    try{
        const contactoActualizado = await Contacto.findByIdAndUpdate(
            req.params.id, // ID de la url
            req.body,   // nuevos datos
            {
                new: true,  // devolver el docucmento modificado
                runValidators:true // aplicar validaciones del esquema
            }   
        );
        if (!contactoActualizado){
            return res.status(404).json({ error: 'Contacto no encontrado'});
        }
        res.json(contactoActualizado);
    }catch (error){
        res.status(400).json({ error: error.message});
    }
});

// DELETE /api/contactos/:id
// Elimina un contacto por su ID

enrutador.delete('/:id', async (req, res)=>{
    try{
        const eliminado = await Contacto.findByIdAndDelete(req.params.id);
        if (!eliminado){
            return res.status(404).json({ error: ' Contacto no encontrado'});
        }
        res.json({mensaje: 'Comtacto eliminado correctamente'});
    } catch (error) {
        res.status(400).json({ error: 'Id invalido'});
    }
});



module.exports = enrutador;