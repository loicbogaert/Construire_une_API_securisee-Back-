const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    /**User */
    email: { type : String, required: true, unique: true, validate : /^(?=.*[A-Za-z1-9])[^\/){}\]\]$\\"'!=;,:§]{4,}/},
    password : { type : String, required: true},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('listofallusers', userSchema)