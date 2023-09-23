const Book = require("../models/Book");


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
 const getAllBooks = async (req, res) =>{
   //! => renvoie le protocol (http ou https):// le host ( localhost:port recuperé si different de 4000)
    const apiUrl = `${req.protocol}://${req.get('host')}`;

    try {
      //! sort moi tout les livre et tu me les range du plus recent au plus ancien
      const books = await Book.find().sort({ _id: -1 });
       books.map(book=> {
        book.imageUrl = apiUrl+`/uploads/books/${book.imageUrl}`
        return book
      })
      res.status(200).json(books);
    } catch (error) {
      return res.status(500).json({ message: error.message});
    }
  }

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const addBook = async (req, res, next) => {
    try {


        //  on verifie si l'utilisateur a choisir une image pour le livre 
        //  s'il n'y a pas de file dans la req il dois choissi un fichier donc on genere une exception qui renvoie a catch

        if(!req.file){
            throw new Error("Vous devez ajouter une image")
        }
        // réccupération du nom de l'image du livre
        const filename =  req.file.filename

        // reccupération des données du livre. On utilise JSON.parse parce les données sont encodé

        const bookData = JSON.parse(req.body.book);

        // initiation de la note
        // lors de la créaction si il n'ya pas de note on garde 0 pour evite null si la note est > 0 on garde la note definie 
        const averageRating = bookData.averageRating | 0

        // on fais un maj (spread operation (destruturation)) des information du formulaire avant de stocker dans la db : note et image
        const newBook = new Book({...bookData,averageRating:averageRating, imageUrl:filename})

        // Enregistrez le nouveau livre dans la base de données
        newBook.save()
      res.status(200).json({message:"le livre a été ajouté"});

    } catch (error) {
      return res.status(500).json({ message: error.message, });
    }

}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getBookById = async (req, res)=> {
    const apiUrl = `${req.protocol}://${req.get('host')}`;

    const bookId = req.params.id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    book.imageUrl = apiUrl+`/uploads/books/${book.imageUrl}`

    res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

const getBestratingBook = (req, res)=> {
    return res.json({message:"3 meiilleurs livres"})

}


/**
 *  Mise à jour du livre
 * @param {*} req 
 * @param {*} res 
 */
const updategBook = async (req, res)=> {


    try {

        // réccupération de l'id du livre
        const bookId = req.params.id;

        // réccupération du livre dans la base de donées
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        let updateData = req.body
        
        // verifie si l'image du livre a été modifié
        if(req.file){
         // réccupération du nom de l'image du livre
         const filename =  req.file.filename

            // d"codage des informations du livre
            updateData = JSON.parse(req.body.book);
            updateData = {...updateData, imageUrl:filename}

        }


        // Mettez à jour le livre par son ID
        await Book.findByIdAndUpdate(bookId,updateData);

        return res.status(200).json({message:"Le livre a été mise à jour"})
        




        
    } catch (error) {
    return res.status(500).json({ message: error.message });
    }

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const deltegBook = (req, res)=> {

    return res.json({message:"suppression du livre"})
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const rategBook = (req, res)=> {
    return res.json({message:"noté un livre"})

}


module.exports = {
    getAllBooks,
    addBook,
    getBookById,
    getBestratingBook,
    updategBook,
    deltegBook,
    rategBook
    // Exportez d'autres fonctions de contrôleur au besoin
  };