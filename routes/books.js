const express = require('express');
const router = express.Router();

const multer = require('multer'); 
var path = require("path");



/**Configuration des fichier images autoriser */
const ALLOED_MIME_TYPES = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",

  };
  

  /**
   * Configuration du téléchargement des images (que l'utilisateur choisi lors de l'ajout d'un livre,maj) des livres avec la libraire "multer":
   * 
   * La la methode "destination" télécharge l'image dans le repectoire "public/uploads/books"
   * La la methode "filename" donne un nom personnalisé à l'image téléchargée.
   * 
   * Nomenclature du nom du fichier: "date_actuelle-nom_original_du_fichier"
   * 
   */

  //! multer.diskStorage: configurer le stockage des fichiers téléchargés sur le disque dur du serveur
  //! cb : fonction de rappel qui doit être appelée pour indiquer à multer où stocker les fichiers téléchargés
  const configurationTelechargement = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = ALLOED_MIME_TYPES[file.mimetype];
      let error = new Error("Mime type invalide");
      if (isValid) {
        error = null;
      }
      cb(error, path.join(__dirname, "../public/uploads/books"));
    },
    filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(" ").join("-");
      cb(null,  Date.now() + "-" +name);
    },
  });
  

  // utilisation de la configuration de téléchargement avec "multer"
  const ImageUpload = multer({ storage: configurationTelechargement });




// importation des middlewares
const bookMiddleware = require("../middlewares/bookMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")


// fonctions du controller "book"
const {
    getAllBooks, 
    addBook, 
    getBookById, 
    getBestratingBook,
    updategBook,
    deltegBook,
    rategBook} = require("../controllers/BookController");


// Renvoie un tableau de tous les livres de la base de données
router.get('/', getAllBooks)


/**
 * Capture et enregistre l'image, analyse le livre
 * transformé en chaîne de caractères, 
 * et l'enregistre dans la base de données en définissan correctement son ImageUrl.
 * Initialise la note moyenne du livre à 0 et le rating
 * avec un tableau vide. Remarquez que le corps de la demande initiale est vide ; 
 * lorsque Multer est ajouté,il renvoie une chaîne pour le corps de la demande 
 * en fonction des données soumises avec le fichier.
 */
router.post('/', authMiddleware.authenticate, ImageUpload.single("image"), addBook)



// Renvoie le livre avec l’_id fourni.
router.get('/:id', getBookById)


/**
 * Renvoie un tableau des 3 livres de la base de
 * données ayant la meilleure note moyenne.
 */
router.get('/bestrating', getBestratingBook)


/**
 * Met à jour le livre avec l'_id fourni. Si une image est téléchargée,
 * elle est capturée, et l’ImageUrl du livre est mise à jour. 
 * Si aucun fichier n'est fourni, 
 * les informations sur le livre se trouvent directement dans le corps de la requête (req.body.title,
 * req.body.author, etc.). Si un fichier est fourni, le livre transformé en chaîne de caractères se trouve dans req.body.book. 
 * Notez que le corps de la demande initiale est vide ; 
 * lorsque Multer est ajouté, il renvoie une chaîne du corps de la demande basée sur les données soumises avec le fichier.
 */
router.put('/:id', authMiddleware.authenticate, bookMiddleware.authorize,ImageUpload.single("image"), updategBook)




//Supprime le livre avec l'_id fourni ainsi que l’image associée.
router.delete('/:id',authMiddleware.authenticate, bookMiddleware.authorize, deltegBook)


/**
 * Définit la note pour le user ID fourni.La note doit être comprise entre 0 et 5
 * L'ID de l'utilisateur et la note doivent être ajoutés au tableau "rating" 
 * afin de ne pas laisser un utilisateur noter deux fois le même livre.
 * Il n’est pas possible de modifier une note.
 * La note moyenne "averageRating" doit être tenue à jour, et le livre renvoyé en réponse de la requête.
 */
router.put('/:id/rating', authMiddleware.authenticate, rategBook)


// on export le "router" car on utilise ce fichier dans app.js
module.exports = router