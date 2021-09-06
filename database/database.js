const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => mongoose.connect(process.env.BDD_LOGIN,
    { useNewUrlParser : true,
    useUnifiedTopology : true})
.then(()=> console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = {
    connect
}