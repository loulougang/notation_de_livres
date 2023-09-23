const jwt = require('jsonwebtoken');

const User = require("../models/User");

const authenticate = async (req, res, next) =>{
    // Mettez en œuvre la logique d'authentification ici
    // Vérifiez le token JWT, chargez l'utilisateur, etc.
    // Si l'authentification réussit, stockez l'utilisateur dans req.user
    // Sinon, renvoyez une réponse d'erreur

    try{

    var userauthorization_token = req.headers.authorization.split(" ")[1];
    var decode_user_token = jwt.verify(
      userauthorization_token,
      'BOOK_API_2415TY'
    );
    var userId = decode_user_token.userId;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message:
          "Vous n'êtes pas autoriser à effectuer cette requête veillez vous connectez !",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message:error.message,
    });
  }

  }
  
  module.exports = {
    authenticate,
  };
  