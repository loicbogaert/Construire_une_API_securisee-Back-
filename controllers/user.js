const User = require('../models/User');
const bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

require('dotenv').config();
const TOKEN = process.env.SECRET_TOKEN;


    /** class User with controllers concerning Users informations (logs) */

class Users{

    /** Singup controller (password with HASH and masked email) */
    signingUp(req, res, next){
        const email = req.body.email;
        var key = CryptoJS.enc.Hex.parse(process.env.CRYPTOJS_KEY);
        var iv = CryptoJS.enc.Hex.parse(process.env.CRYPTOJS_IV);
        var encrypted = CryptoJS.AES.encrypt(email, key,{iv:iv}).toString();

       
            /**Test for secured password */
        if(/^(?=.*[A-Za-z1-9])(?=.*[0-9])(?=.*[A-Z])[^){}\[\]\*\\"'!=;,:§]{8,}/.test(req.body.password)) { 
             /**generate salt */
            bcrypt.genSalt(SALT_WORK_FACTOR)
            .then(salt => {
                /**hash password */
                    bcrypt.hash(req.body.password, salt)
                    .then(hash =>{
                        const user = new User({
                            email: encrypted,
                            password: hash
                        });
                    user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                    .catch(error => res.status(400).json({ error }))
                })
                .catch(error => res.status(500).json({ error }));
            })
        }  else {
            res.statusMessage = ('Votre mot de passe doit contenir au minimum 8 caractères, une majuscule et un chiffre')
            res.status(400).end()
        }
    };
        
    /** Loging controller (Find existing email and password (match hashed password) + Token creation) */

    logingIn(req, res , next){
        const email = req.body.email;
        const password = req.body.password;
        var key = CryptoJS.enc.Hex.parse(process.env.CRYPTOJS_KEY);
        var iv = CryptoJS.enc.Hex.parse(process.env.CRYPTOJS_IV);
        var encrypted = CryptoJS.AES.encrypt(email, key,{iv:iv}).toString();
            User.findOne({email : encrypted})
            .then(user =>{
                if(!user) {
                     return res.status(401).json({ error : 'Utilisateur non trouvé !'})
                }
                bcrypt.compare(password, user.password, (err, data) => {
                    if (err) throw (error => res.status(500).json({ error }));
    
                    /**if both passwords match */
                    if (data) {
                        return res.status(200).json({
                            userId: user._id,     
                            token: jwt.sign(
                              { userId: user._id },
                                TOKEN,
                              { expiresIn: '24h' }) 
                            })
                    /**if passwords do not match*/
                    } else {
                        return res.status(401).json({ error : "Mot de passe incorrect" })
                    };
                });
            })
        .catch(error => res.status(500).json({ error }));
    };
}

module.exports = Users;