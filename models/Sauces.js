const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    name: { type : String, required: true, validate : /^(?=.*[A-Za-z1-9])[^\/){}\]\]$\\"'!=;,:§]{2,}/},
    manufacturer : { type : String, required: true, validate : /^(?=.*[A-Za-z1-9])[^\/){}\]\]$\\"'!=;,:§]{2,}/},
    description : { type : String, required: true, validate : /^(?=.*[A-Za-z1-9])[^\/){}\]\]$\\"'!=;,:§]{2,}/},
    mainPepper : { type : String, required: true, validate : /^(?=.*[A-Za-z1-9])[^\/){}\]\]$\\"'!=;,:§]{2,}/},
    heat : { type : Number, required: true},
    imageUrl : { type : String, required: true},
    userId : { type : String, required: true},
    likes : { type : Number, required: true},
    dislikes : { type : Number, required: true},
    usersLiked : { type : [String], required: true},
    usersDisliked : { type : [String], required: true}
});

module.exports = mongoose.model('ListOfSauces', sauceSchema);
