const jwt = require('jsonwebtoken');

const Book = require("../models/Book");


// middlewares/authorizationMiddleware.js
const authorize =async (req, res, next) =>{
    try {
        // Réccuperer l'id de l'utilisateur dans la requete
    var userauthorization_token = req.headers.authorization.split(" ")[1];
    var decode_user_token = jwt.verify(
      userauthorization_token,
      'BOOK_API_2415TY'
    );
    var userId = decode_user_token.userId;
  
  // Récupérez l'ID du livre à partir de la requête (supposons qu'il soit dans req.params)
  const bookId = req.params.id; // Assurez-vous d'avoir une route /books/:bookId

  // Recherchez le livre dans la base de données
  const book = await Book.findById(bookId);


  if (!book) {
    return res.status(404).json({ message: 'Livre non trouvé' });
    }

    if (book.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Accès non autorisé' });
        }
    
        // L'utilisateur est autorisé à apporter des modifications
        next();

    } catch (error) {
        return res.status(401).json({
            message:error.message,
          });
    }
  }
  
  module.exports = {
    authorize,
  };
  