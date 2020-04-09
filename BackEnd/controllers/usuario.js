const Usuario = require('../models/Usuario')
const crypto = require('crypto');
// Itens para envio de email
const nodeMailer = require('nodemailer')
const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "desafioagendadecontatos@gmail.com",
        pass: "agendadecontatos159"
    }
})

const controller = {}

controller.novo = async (req, res) => {
    let usuario = req.body;
    usuario.senha = criptografarSenha(usuario.senha);

    //Validando se o e-mail ja foi cadastrado
    try{
        const validEmail = await Usuario.find({email: {$regex: usuario.email, $options: 'i'}});
        if(validEmail.length > 0){
            res.status(400).send("E-mail ja cadastrado")
            return;
        }
    }
    catch(erro){
        console.log(erro)
        res.status(500).send(erro)
    }


    try{
        await Usuario.create(usuario)
        // Configurando e-mail a ser enviado
        let mailOptions = {
            from: 'no-reply@agendacontatos.com',
            to: usuario.email,
            subject: 'Bem vindo a Agenda de Contatos!',
            text: 'Obrigado por se cadastrar na nossa agenda de contatos!'
        };

        // Enviando e-mail
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.status(500).send(error)
            } else {
                res.sendStatus(201)
            }
        });
    }
    catch(erro){
        console.log(erro)
        res.status(500).send(erro)
    }
}

controller.login = async (req, res) => {
    let usuario = req.body;
    usuario.senha = criptografarSenha(usuario.senha);
    try{
        const result = await Usuario.find({email: {$regex: usuario.email, $options: 'i'}});
        if(result.length > 0){
            let conta = result[0] // find retorna uma lista de usuarios, mas preciso apenas do primeiro
            if(conta.senha == usuario.senha)
                res.status(200).send(conta._id);
    
            res.status(400).send("E-mail ou senha incorretas")
        }

        res.status(404).send("E-mail não encontrado");
    }
    catch(erro){
        console.log(erro)
        res.status(500).send(erro)
    }
}

controller.listar = async (req, res) => {
    try{
        const usuario = await Usuario.find();
        res.send(usuario);
    }
    catch(erro){
        console.log(erro)
        res.status(500).send(erro)
    }
}

function criptografarSenha(senha){
    const algoritmo = "aes-192-cbc";
    const chave = crypto.scryptSync(senha, 'salt', 24);

    const cipher = crypto.createCipher(algoritmo, chave);
    senha = cipher.update(senha, 'utf8', 'hex');
    senha += cipher.final("hex");
    return senha;
}

module.exports = controller