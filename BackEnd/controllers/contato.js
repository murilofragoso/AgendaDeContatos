const Contato = require('../models/Contato')

const controller = {}

controller.novo = async (req, res) => {
    let contato = req.body
    // Transformando em JSON novamente, caso venha em string por stringfy
    if(typeof(contato.telefones) == "string")
        contato.telefones = JSON.parse(contato.telefones)

    if(typeof(contato.enderecos) == "string")
        contato.enderecos = JSON.parse(contato.enderecos)

    // Validando nome
    if(!contato.nome){
        res.status(400).send("Nome Obrigatório");
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
    try{
        const contatos = await Contato.find();
        res.send(contatos);
    }
    catch(erro){
        console.log(erro)
        res.status(500).send(erro)
    }
}

module.exports = controller