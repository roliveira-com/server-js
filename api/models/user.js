const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: {type:String,required:true},
    sobrenome: {type:String,required:true},
    email: {type:String,required:true},
    senha: {type:String,required:true},
    created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('User', userSchema);