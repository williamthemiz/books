process.env.NODE_ENV = 'test';

const mongoose  = require('mongoose');
let Book        = require('../controllers/models/book');


//dependencias para el testing

const chai      = require('chai');
const chaiHttp  = require('chai-http');
const server    = require('../server');
let should      = chai.should();

chai.use(chaiHttp);

//vaciar registros de DB de prueba antes de iniciar tests 

describe('Books',() => {
    beforeEach((done) => {
        Book.remove({},(err) => {
            done()
        });
    });



// testing GET /books

describe('/GET books',() =>{
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

describe('GET books/:id',() =>{
    it('SHOULD get the book with the specified id',(done) => {
        let book = new Book(
        {
            title   : 'Harry Potter',
            author  : 'JK Rowling',
            year    : 1954,
            pages   : 600
        });

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
        })
    });
});

});