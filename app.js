const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/User');
const saucesRoutes = require('./routes/Sauces');
const path = require('path');
const helmet = require("helmet");

const db = require('./database/database');
db.connect();

const app = express();

    /**Helmet security*/

app.use(helmet());

    /**headers cross origin resource sharing*/

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

    /**init routes */

app.use(bodyParser.json());
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
    
    /**image folder */

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

