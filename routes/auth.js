
const express = require('express');
const router = express.Router();

// fonctions du controller "auth"
const {
    login, 
    signup
} = require("../controllers/authController");

// Création de compte utilisateur
router.post('/signup', signup)


// connexion d'un utilisateur
router.post('/login', login)


// on export le "router" car on utilise ce fichier dans app.js
module.exports = router
