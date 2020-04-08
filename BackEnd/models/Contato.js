const mongoose = require('mongoose')

const esquemaContato = mongoose.Schema({
    idUsuario:{
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    telefones: [{
        numero:{
            type: Number,
            required: true
        }
    }],
    enderecos: [{
        cep: Number,
        logradouro: String,
        numero: Number,
        bairro: String,
        complemento: String,
        cidade: String,
        uf: String
    }]
})

module.exports = mongoose.model('Contato', esquemaContato, 'contatos')