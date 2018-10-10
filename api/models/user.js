const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: String,
    sobrenome: String,
    email: String,
    senha: String,
    created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('User', userSchema);