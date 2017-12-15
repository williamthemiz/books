const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = 8080;
const book = require('./controllers/routes/book');
const config = require('config');

//opciones de la conexion a db
let opciones = {
    useMongoClient: true 
};

//conexion a db
mongoose.connect(config.DBHost,opciones);
let db = mongoose.connection;
db.on('error',console.error.bind(console,'error de conexion'));

//no mostrar logs en testing
if(config.util.getEnv('NODE_ENV') !== 'test')
{
    app.use(morgan('combined')); //usar morgan para mostrar logs
}

//parsear application/json

app.use(bodyParser.json());                         //para parsear application/json
app.use(bodyParser.urlencoded({extended: true}));   //para parsear application/x-www-form-urlencoded
app.use(bodyParser.text());                         //parsear texto plano                            
app.use(bodyParser.json({ type: 'application/json'}));  

//rutas

app.get("/",(req,res)=>{
    res.json({
        message: "Bienvenido a la biblioteca!"
    })
});

app.route("/books")
    .get(book.getBooks)
    .post(book.postBook);

app.route("/books/:id")
    .get(book.getBook)
    .put(book.updateBook)
    .delete(book.deleteBook);

//arrancar server
app.listen(port);
console.log("Listening on port "+port);

module.exports = app; //para pruebas