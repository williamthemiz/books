const mongoose = require('mongoose');
const Book = require('../models/book');

// GET /books

function getBooks(req,res)
    {   
        let query = Book.find({});
        query.exec((err,books) =>{
            if(err) res.send(err);

            res.json(books);
        })
    }

//  POST /books

function postBook(req,res)
    {
        const newBook = new Book(req.body);

        newBook.save((err,book) =>{
            if(err)
                {
                    res.send(err);
                }
            else
                {
                    res.json({message : "Libro agregado",book});
                }
        });
    }

//  GET /book/:id

function getBook(req,res)
    {
        Book.findById(req.params.id,(err,book) =>{
            if(err) res.send(err);

            res.json(book);
        });
    }

// PUT /book/:id

function updateBook(req,res)
    {
        Book.findById({_id : req.params.id},(err,book) =>{
            if(err) res.send(err);

            Object.assign(book,req.body).save((err,book) =>{
                if(err) res.send(err);

                res.json({message : 'Libro actualizado', book });
            })
        });
    }

// DELETE /book/:id

function deleteBook(req,res)
    {
        Book.remove({_id : req.params.id},(err,result) =>{
           if(err) res.send(err);

           res.json({message : "Libro eliminado!",result});
        });
    }   

//exportar funciones

module.exports = {
    getBooks,
    getBook,
    postBook,
    updateBook,
    deleteBook
}