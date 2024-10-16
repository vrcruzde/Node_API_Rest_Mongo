const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')

//MIDDLEWARE
const getBook = async (req, res, next) =>{
    let book;
    const {id} = req.params;

    if (!id.match(/[0-9a-fA-F]{24}$/)){
        return res.status(400).json(
            { message: 'ID no válido.' 

            }
        )
    }
    try{
        book = await Book.findById(id)
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado.' })
        }
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({ message: 'Error al encontrar el libro.' })
    }
    res.book = book;
    next()
}


// obtener todos los libros

router.get('/', async (req, res) => {
  try {
    const books = await Book.find()
    console.log('GET ALL', books)
    if (books.length === 0){
        return res.status(204).json([])
    }
    res.json(books)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Crear un nuevo libro

router.post('/', async (req, res) => {
    const {titulo, autor, genero, fecha_publicacion} = req?.body
    if (!titulo || !autor || !genero || !fecha_publicacion){
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' })
    }

  const book = new Book({
    titulo,
    autor,
    genero,
    fecha_publicacion,
  })

  try {
    const newBook = await book.save()
    console.log('POST', newBook)
    res.status(201).json(newBook)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Obtener un libro por ID

router.get('/:id', getBook, async(req, res) => {
  res.json(res.book);
})

// Actualizar un libro por ID

router.put('/:id', getBook, async (req, res) => {
  try{
    const book = res.book
    book.titulo = req.body.titulo || book.titulo
    book.autor = req.body.autor || book.autor
    book.genero = req.body.genero || book.genero
    book.fecha_publicacion = req.body.fecha_publicacion || book.fecha_publicacion

    const updatedBook = await book.save()
    console.log('PUT', updatedBook)
    res.json(updatedBook)
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Actualizar un parametro por ID

router.patch('/:id', getBook, async (req, res) => {
  if (req.body.titulo && req.body.autor && req.body.genero && req.body.fecha_publicacion){
    res.status(400).json({ 
      message:'Al menos uno de estos campos debe ser enviado: Titulo, Autor, Genero o Fecha de publicación'
    })
  }

  try{
    const book = res.book
    book.titulo = req.body.titulo || book.titulo
    book.autor = req.body.autor || book.autor
    book.genero = req.body.genero || book.genero
    book.fecha_publicacion = req.body.fecha_publicacion || book.fecha_publicacion

    const updatedBook = await book.save()
    res.json(updatedBook)
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Eliminar un libro por ID

router.delete('/:id', getBook, async (req, res) => {
  try {
    const book = res.book
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    await book.deleteOne();
    res.json({ 
      message: `El libro ${book.titulo} fue eliminado correctamente` 
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})






module.exports = router
