const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        titulo: String,
        autor: String,
        genero: String,
        fecha_publicacion: String,    
    })

module.exports = mongoose.model('Book', bookSchema);

