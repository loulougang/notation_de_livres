const port = process.env.PORT || 4000;
const app = require("./app")


app.listen(port, () => {
    console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
  });
