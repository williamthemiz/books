process.env.NODE_ENV = 'test';

const mongoose  = require('mongoose');
const factory   = require('factory-girl').factory;
let Book        = require('../controllers/models/book');


//probando factory girl

factory.define('book',Book,{
        title:      factory.sequence('book.title',n =>`Libro-${n}`),
        author:     factory.chance('name'),
        year:       factory.chance('year',{min: 1500, max: 2017}),
        pages:      factory.chance('natural',{min:1,max:1000}),
        createdAt:  factory.chance('date',{year:2017})
});


/*
factory.buildMany('book',5).then(books =>{
    console.log(books);
});
*/

//dependencias para el testing

const chai      = require('chai');
const chaiHttp  = require('chai-http');
const server    = require('../server');
let should      = chai.should();

chai.use(chaiHttp);

//vaciar registros de DB de prueba antes de iniciar tests 

describe('Books',() => {
    before((done) => {
        Book.remove({},(err) => {
            done()
        });
    });



// testing GET /books

describe('GET /books',() =>{
    it('SHOULD get all the books',(done) => {
        chai.request(server)
            .get('/books')
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.equal(0);
                done();
            });
    });
});

//testing POST /books

describe('POST /books',() =>{
    it('SHOULD NOT add a new book without pages field',(done) =>{
        let book = 
        {
            title   : 'El señor de los anillos',
            author  : 'JRR Tolkien',
            year    : 1954
        }

        chai.request(server)
        .post('/books')
        .send(book)
        .end((err,res) =>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('pages');
            res.body.errors.pages.should.have.property('kind').equal('required');
            done();
        });
    });

    it('SHOULD add a book to the DB',(done) =>{
        
        let book = 
        {
            title   : 'El señor de los anillos',
            author  : 'JRR Tolkien',
            year    : 1954,
            pages   : 600
        }

        chai.request(server)
        .post('/books')
        .send(book)
        .end((err,res) =>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').equal('Libro agregado');
            res.body.book.should.have.property('title');
            res.body.book.should.have.property('author');
            res.body.book.should.have.property('year');
            res.body.book.should.have.property('pages');
            done();
        });
    });
});

//testing GET /books/:id

describe('GET /books/:id',() =>{
    it('SHOULD get the book with the specified id',(done) => {
        factory.build('book').then(book =>{
        book.save((err,book) =>{
            chai.request(server)
                .get('/books/'+book.id)
                .send(book)
                .end((err,res) =>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('author');
                    res.body.should.have.property('year');
                    res.body.should.have.property('pages');
                    res.body.should.have.property('_id').eql(book.id);
                    done();
                });
            });
        });

    });
});

describe('PUT /books/:id',() => {
    it('SHOULD update the book given the id',(done) => {
        /*let book = new Book(
            {
                title: "The Chronicles of Narnia", 
                    author: "C.S. Lewis", 
                    year: 1948, 
                    pages: 778
            });
        */

        factory.build('book').then(book => {
             
            book.save((err,book) => {
                chai.request(server).put('/books/'+book.id)
                .send({
                        title: "The Chronicles of Narnia", 
                        author: "C.S. Lewis", 
                        year: 1950, 
                        pages: 778
                    })
                .end((err,res) =>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').equal('Libro actualizado');
                    res.body.book.should.have.property('year').equal(1950);
                    done();
                });
            });
        });
       
    });
});

describe('DELETE /books/:id',() => {
    it('SHOULD delete the book given the id',() => {
       factory.build('book').then(book =>{
        book.save((err,book) =>{
                chai.request(server)
                .delete('/books/'+book.id)
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message'.equal("Libro eliminado!"));
                    res.body.should.have.property('ok').equal(1);
                    res.body.should.have.property('n').equal(1);
                });
            });
        });

       
    });
});

});