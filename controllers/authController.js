const User = require("../models/User");

const bcrypt =require("bcrypt")

const jwt = require('jsonwebtoken');


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const signup = async (req, res) =>{

    // req.body ==> { email: string,password: string }

    try {

        const {email, password} = req.body

        // cryptage du mot de passe
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            email:email,
            password:passwordHash
        })

        await newUser.save()

        return res.status(200).json({ message: "Le compte de l'utilisateur a été créé" } )
      
    } catch (error) {
         // Si une erreur se produit lors de la validation de l'adresse e-mail unique
    if (error.name === 'ValidationError') {
        const validationErrors = [];
  
        // Parcourez les erreurs de validation et extrayez les messages
        for (const key in error.errors) {
          if (error.errors[key].name === 'ValidatorError') {
            validationErrors.push(error.errors[key].message);
          }
        }
  
        // Renvoyez une réponse avec les messages d'erreur de validation
        return res.status(400).json({ errors: validationErrors });
      }

      return res.status(500).json({ message: error.message });
    }
  }


  /**
 * 
 * @param {*} req 
 * @param {*} res 
 */
 const login = async (req, res) =>{
    try {
        const {email, password} = req.body


        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(401).json({ message: 'Le mail ou le mot de passe est incorrecte'});
        }

        const verification = await bcrypt.compare(password, user.password)

        // vérifie si le mot de passe saisie correspond au mot de passe de l'utilisateur dans la base de données
        if (!verification) {
            return res.status(401).json({ message: 'Le mail ou le mot de passe est incorrecte' });
        }


        // création du token d'authentification
        const token = jwt.sign(
            { userId: user._id },
            'BOOK_API_2415TY',
            { expiresIn: '24h' }
        )


        return res.status(200).json({
            userId: user._id,
            token: token
        });

      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  
module.exports = {
    login,
    signup,
    // Exportez d'autres fonctions de contrôleur au besoin
  };