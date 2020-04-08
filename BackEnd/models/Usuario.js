const mongoose = require('mongoose')

const esquemaUsuario = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Usuario', esquemaUsuario, 'usuarios')