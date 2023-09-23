const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require("cors");
var helmet = require("helmet"); 
var path = require("path");


const app = express();



// connexion a mongoDB
mongoose.connect('mongodb+srv://kouadiobiserge:qO7hsHyZvlappDOt@notationdelivre.enid00a.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



  /**
   * configurations express
   * *
   */
  
app.use(express.json());
// enable cors
app.use(cors());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));


app.use(express.urlencoded({ extended: false }));
//! tout les fichier static (image , gif... seront stocker dans public)
app.use(express.static('public'));



/**
 * Configuration des entêtes des requêtes => autorise l'utilisation des methods defini
 */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



// routes pour la connxion et la création de compte
const authRoutes = require('./routes/auth');


// Routes pour les books
const booksRoutes = require('./routes/books');

// routes pour la connxion et la création de compte
app.use('/api/auth', authRoutes);


// regroupe l'api/books/tape_dans_les_routes
app.use('/api/books', booksRoutes);



// on export le "app" qui est notre application "espress" pour l'utilisaer dans le fichier "server.js"
module.exports = app