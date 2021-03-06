const Contato = require('../models/Contato')
const Usuario = require('../models/Usuario')

const controller = {}

controller.novo = async (req, res) => {
    let contato = req.body
    // Transformando em JSON novamente, caso venha em string por stringfy
    if(typeof(contato.telefones) == "string")
        contato.telefones = JSON.parse(contato.telefones)

    if(typeof(contato.enderecos) == "string")
        contato.enderecos = JSON.parse(contato.enderecos)

    // Validando id do usuário
    if(!contato.idUsuario){
        res.status(400).send("id do usuário obrigatório");
        return;
    }

    // Validando se id do usuário existe
    try{
        const usuario = await Usuario.find({_id: contato.idUsuario});
        if(usuario.length == 0){
            res.status(400).send("id do usuário não encontrado");
            return;
        }
    }
    catch(erro){
        console.log(erro)
        res.status(500).send(erro)
    }
    
    // Validando nome
    if(!contato.nome){
        res.status(400).send("Nome obrigatório");
        return;
    }

    // Validando telefones
    if(contato.telefones){
        let telefonesInvalidos = "";
        contato.telefones.forEach(element => {
            if(!element.numero || isNaN(element.numero) || element.numero.toString().length < 9){
                telefonesInvalidos += element.numero + ", "
            }
        });
    
        if(telefonesInvalidos){
            res.status(400).send("Formato de telefones incorretos: " + telefonesInvalidos)
            return;
        }
    }

    // Validando endereços
    if(contato.enderecos){
        let numEnderecoInvalidos = "";
        contato.enderecos.forEach(element => {
            if(isNaN(element.numero)){
                numEnderecoInvalidos += element.numero + ", "
            }
        })

        if(numEnderecoInvalidos){
            res.status(400).send("Número do endereço deve conter apenas números: " + numEnderecoInvalidos)
            return;
        }
    }

    try{
        await Contato.create(contato)
        res.sendStatus(201)
    }
    catch(erro){
        console.log(erro)
        res.status(500).send(erro)
    }
}

controller.listar = async (req, res) => {
    let idUsuario = req.query.idUsuario;
    if(!idUsuario){
        try{
            const contatos = await Contato.find();
            res.send(contatos);
        }
        catch(erro){
            console.log(erro)
            res.status(500).send(erro)
        }
    }else{
        try{
            const contatos = await Contato.find({idUsuario: idUsuario});
            res.send(contatos);
        }
        catch(erro){
            console.log(erro)
            res.status(500).send(erro)
        }
    }
}

controller.atualizar = async (req, res) => {
    try{
        let contato = req.body

        if(typeof(contato.telefones) == "string")
            contato.telefones = JSON.parse(contato.telefones)

        if(typeof(contato.enderecos) == "string")
            contato.enderecos = JSON.parse(contato.enderecos)

        const id = contato._id
        const obj = await Contato.findByIdAndUpdate(id, contato)
        
        if(obj){// Objeto encontrado e atualizado
            // HTTP 204: No Content
            res.status(204).end()
        }
        else{
            res.status(404).end()
        }
    }
    catch(erro){
        console.log(erro)
        res.status(500).send(erro)
    }
}

controller.excluir = async(req, res) =>{
    try{
        const id = req.body._id
        const obj = await Contato.findByIdAndDelete(id)
        if(obj){
            res.status(204).end()
        }
        else{
            res.status(404).end()
        }
    }
    catch(erro){
        console.log(erro)
        res.status(500).send(erro)
    }
}

module.exports = controller