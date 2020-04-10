$(document).ready(function () {
    // Abrir tela de cadastro de contato
    $("#btnNovoContato").click(function(){
        $("#containerContatos").hide();
        $("#containerCadastroContato").show();
        $("#hddnIdContato").val("");
        $("#divTituloCadastroContato").html("<h1>Novo Contato</h1>")
    })

    // Fechar tela de cadastro de contato
    $("#btnCancelarNovoContato").click(function(){
        $("#containerCadastroContato").hide();
        $("#containerContatos").show();
        limpaListaTelefonesEndereco();
        // OBS: não é necessário limpar os campos manualmente, pois o botão é do tipo "reset"
    })

    //Adicionar um telefone a lista de telefones do contato
    $("#addTelefone").click(function(){
        let numeroTelefone = $("#inputTelefone").val();
        
        if(!numeroTelefone){ // Validando se o telefone existe
            alert("Adicione um número de telefone!");
            return;
        }else if(isNaN(numeroTelefone)){ // Validando se o telefone tem apenas números
            alert("O telefone deve conter apenas números")
            return;
        }else if(numeroTelefone.toString().length < 9){ // Validando se o telefone tem pelo menos 9 digitos
            alert("O telefone deve possuir no mínimo 9 dígitos");
            return;
        }

        // Validando se o telefone ja foi adicionado para aquele contato
        let valid;
        $("#tableNovoContatoTelefones tbody tr").each(function(){
            if($(this).children().first().text() == numeroTelefone){
                valid = "Este número ja foi adicionado para este contato";
            }
        })

        if(valid){
            alert(valid);
            return;
        }

        $("#tableNovoContatoTelefones").show();
        $("#tableNovoContatoTelefones tbody").append("<tr><td>"+ numeroTelefone + "</td><td class='btnTableExcluir'>Excluir</td></tr>")
        $("#inputTelefone").val("").focus();
    })

    //Excluir um telefone da lista de telefones do contato
    $("#tableNovoContatoTelefones").on("click", ".btnTableExcluir", function(){
        if(confirm("Deseja excluir esse telefone?")){
            $(this).closest('tr').remove();
        }
        if($("#tableNovoContatoTelefones tbody td").length == 0)
            $("#tableNovoContatoTelefones").hide();
    })

    //Buscar um endereço pelo CEP
    $("#buscaCep").click(function(){
        let cep = $("#inputCep").val();

        // Validando o cep
        if(isNaN(cep)){
            alert("CEP deve possuir apenas números")
            return;
        }else if(cep.length != 8){
            alert("CEP deve possuir 8 dígitos")
            return;
        }

        $.ajax({
            url: "https://viacep.com.br/ws/"+ cep +"/json/",
            type: 'get'
        }).done(function(end){
            if(end.erro){
                alert("CEP não encontrado")
                return;
            }

            $("#inputLogradouro").val(end.logradouro)
            $("#inputBairro").val(end.bairro)
            $("#inputComp").val(end.complemento)
            $("#inputCidade").val(end.localidade)
            $("#inputUF").val(end.uf)
            $("#inputNumero").focus();
        })
    })

    //Adicionar um endereço
    $("#btnNovoEndereco").click(function(){
        if($("#inputNumero").val() && isNaN($("#inputNumero").val())){
            alert("O número da casa deve conter apenas números")
            return;
        }

        let linhaEndereco = 
        "<tr>" +
            "<td class='tdCep'>"+ $("#inputCep").val() + "</td>" +
            "<td class='tdLogradouro'>"+ $("#inputLogradouro").val() + "</td>" +
            "<td class='tdNumero'>"+ $("#inputNumero").val() + "</td>" +
            "<td class='tdBairro'>"+ $("#inputBairro").val() + "</td>" +
            "<td class='tdComp'>"+ $("#inputComp").val() + "</td>" +
            "<td class='tdCidade'>"+ $("#inputCidade").val() + "</td>" +
            "<td class='tdUf'>"+ $("#inputUF").val() + "</td>" +
            "<td class='btnTableExcluir'>Excluir</td>" +
        "</tr>"

        $("#tableNovoContatoEnderecos").show();
        $("#tableNovoContatoEnderecos tbody").append(linhaEndereco)
        limparCamposEndereco();
    });

    function limparCamposEndereco(){
        $("#inputCep").val("");
        $("#inputLogradouro").val("");
        $("#inputNumero").val("");
        $("#inputBairro").val("");
        $("#inputComp").val("");
        $("#inputCidade").val("");
        $("#inputUF").val("");
    }

    //Excluir um endereço da lista de endereços do contato
    $("#tableNovoContatoEnderecos").on("click", ".btnTableExcluir", function(){
        if(confirm("Deseja excluir esse endereço?")){
            $(this).closest('tr').remove();
        }
        if($("#tableNovoContatoEnderecos tbody td").length == 0)
            $("#tableNovoContatoEnderecos").hide();
    })

    // Submit do form de cadastro de contato
    $("#formCadastroContato").submit(function(event){
        event.preventDefault();
        let idUsuarioLogado = window.localStorage.getItem('idUsuarioLogado');

        if(!idUsuarioLogado){
            redirectToLogin();
            return;
        }

        //Verificando nome
        if(!$("#inputNome").val()){
            alert("É necessário adicionar um nome ao contato");
            return;
        }

        //Verificando se existe algum telefone pendende te cadastro
        if($("#inputTelefone").val()){
            alert("Para cadastrar um telefone, clique em 'Cadastrar Telefone'");
            return;
        }

        //Verificando se existe algum endereço pendente de cadastro
        if( $("#inputCep").val() || $("#inputLogradouro").val() || $("#inputNumero").val() || $("#inputBairro").val() ||
            $("#inputComp").val() || $("#inputCidade").val() || $("#inputUF").val()){
            alert("Para cadastrar um endereço, clique em 'Cadastrar Endereço'");
            return;
        }

        let tel = [];
        let end = [];

        //Recuperando telefones
        $("#tableNovoContatoTelefones tbody tr").each(function(){
            tel.push({numero: $(this).children().first().text()})
        })

        //Recuperando endereço
        $("#tableNovoContatoEnderecos tbody tr").each(function(){
            end.push(
                {
                    cep: $(this).children().filter($(".tdCep")).text(),
                    logradouro: $(this).children().filter($(".tdLogradouro")).text(),
                    numero: $(this).children().filter($(".tdNumero")).text(),
                    bairro: $(this).children().filter($(".tdBairro")).text(),
                    complemento: $(this).children().filter($(".tdComp")).text(),
                    cidade: $(this).children().filter($(".tdCidade")).text(),
                    uf: $(this).children().filter($(".tdUf")).text(),
                }
            )
        })

        let contato = {
            nome: $("#inputNome").val(),
            telefones: JSON.stringify(tel),
            enderecos: JSON.stringify(end),
            idUsuario: idUsuarioLogado
        }

        if($("#hddnIdContato").val())
            contato._id = $("#hddnIdContato").val()

        $.ajax({
            url: "http://localhost:3000/contato",
            type: contato._id ? 'PUT': 'POST',
            data: contato
        }).done(function(retorno){
            //atualizar lista de contatos
            limpaListaTelefonesEndereco();
            $("#containerCadastroContato").hide();
            getContatos();
        }).fail(function(jqXHR, textStatus, msg){
            alert("Erro ao salvar contato: " + msg)
        });
    })

    // método para limpar listas de telefones e endereços
    function limpaListaTelefonesEndereco(){
        $("#inputNome").val("");
        $("#tableNovoContatoTelefones tbody").html(""); 
        $("#tableNovoContatoTelefones").hide();
        $("#tableNovoContatoEnderecos tbody").html("");
        $("#tableNovoContatoEnderecos").hide();
    }

    //Recuperando contatos
    var contatos; // Variavel usada para abrir um contato e pesquisar
    function getContatos(){
        let idUsuarioLogado = window.localStorage.getItem('idUsuarioLogado');
        if(!idUsuarioLogado){
            redirectToLogin();
            return;
        }

        $.ajax({
            url: "http://localhost:3000/contato?idUsuario=" + idUsuarioLogado,
            type: 'get',
        }).done(function(data){
            //atualizar lista de contatos
            contatos = data;
            let contatosAgrupados = [];
            let sugestoes = "";
            // Agrupando contatos e preparando para adiciona-los na sugestão de busca
            $.each(data, function(index, valor){
                // Montando opção que será adicionada na sugestão de busca
                sugestoes += "<option value='"+ valor.nome + "'></option>";
                // Pegando inicial do contato atual
                let inicialNome = valor.nome.substr(0,1).toUpperCase();

                //Verificando se ja existe um grupo com essa inicial
                let posicao;
                $.each(contatosAgrupados, function(index, valor){
                    if(valor.inicial == inicialNome)
                        posicao = index;
                })

                //Caso ja exista, adicionar este contato na lista deste grupo
                if(!isNaN(posicao)){
                    contatosAgrupados[posicao].contatos.push(valor)
                }else{ // Se não, criar novo agrupamento
                    contatosAgrupados.push({
                        inicial: inicialNome,
                        contatos: [valor]
                    })
                }
            })

            // Ordenando contatos em ordem alfabética
            contatosAgrupados.sort(compararContatosAgrupados)

            // Adicionando linhas
            $("#tableContatos tbody").html(""); // Limpando tabela antes de adicionar novas linhas
            let linhasTabela = "";
            $.each(contatosAgrupados, function(index, valor){
                linhasTabela = 
                "<tr>" +
                    "<th>"+ valor.inicial +"</th>" +
                    "<th></th>" +
                "</tr>";

                $.each(valor.contatos, function(index, valor){
                    linhasTabela +=
                        "<tr data-id=" + valor._id + " class='linhaTabelaContatos'>" +
                            "<td>"+ valor.nome + "</td>" +
                            "<td class='btnTableExcluir'>Excluir</td>" +
                        "</tr>";
                })
                $("#tableContatos").append(linhasTabela);
            })

            // Adicionando contatos na sugestão de busca
            $("#datalistBuscaContato").html(sugestoes); // Adicionando opçoes
            $("#containerContatos").show();
        }).fail(function(jqXHR, textStatus, msg){
            alert("Erro ao recuperar contatos: " + msg)
        });

    }

    // Função para ordenar lista de contatos agrupados
    function compararContatosAgrupados(a, b){
        const inicialA = a.inicial;
        const inicialB = b.inicial;

        let comparacao = 0;
        if (inicialA > inicialB)
            comparacao = 1
        else if (inicialA < inicialB)
            comparacao = -1

        return comparacao;
    }

    //Abrindo contatos
    $("#tableContatos").on("click", ".linhaTabelaContatos", function(event){
        // não abrir caso o local da linha clicado for o botão de excluir
        if($(event.target).is(".btnTableExcluir")){
            event.stopPropagation();
            return;
        }

        let id = $(this).attr("data-id");
        //Buscando o contato clicado
        let contato;
        contatos.forEach(element => {
            if(element._id == id)
                contato = element;
        });

        if(!contato){
            alert("Contato não encontrado");
            return;
        }

        $("#containerContatos").hide();
        $("#containerCadastroContato").show();

        //setando o id
        $("#hddnIdContato").val(id);
        
        //setando o nome
        $("#inputNome").val(contato.nome);

        //setando telefones
        if(contato.telefones){
            contato.telefones.forEach(element => {
                $("#tableNovoContatoTelefones tbody").append("<tr><td>"+ element.numero + "</td><td class='btnTableExcluir'>Excluir</td></tr>")
            });
            $("#tableNovoContatoTelefones").show();
        }

        //setando endereços
        if(contato.enderecos){
            let linhasEndereco = "";
            contato.enderecos.forEach(element => {
                linhasEndereco += 
                    "<tr>" +
                        "<td class='tdCep'>"+ element.cep + "</td>" +
                        "<td class='tdLogradouro'>"+ element.logradouro + "</td>" +
                        "<td class='tdNumero'>"+ element.numero + "</td>" +
                        "<td class='tdBairro'>"+ element.bairro + "</td>" +
                        "<td class='tdComp'>"+ element.complemento + "</td>" +
                        "<td class='tdCidade'>"+ element.cidade + "</td>" +
                        "<td class='tdUf'>"+ element.uf + "</td>" +
                        "<td class='btnTableExcluir'>Excluir</td>" +
                    "</tr>"
            });
    
            $("#tableNovoContatoEnderecos tbody").append(linhasEndereco);
            $("#divTituloCadastroContato").html("<h1>Editar Contato</h1>")
            $("#tableNovoContatoEnderecos").show();
        }
    })

    // Excluindo contato
    $("#tableContatos").on("click", ".btnTableExcluir", function(){
        if(confirm("Deseja excluir esse contato?")){
            let linha = $(this).closest('tr');
            $.ajax({
                url: "http://localhost:3000/contato",
                type: 'delete',
                data: {
                    _id: linha.attr("data-id")
                }
            }).done(function(data){
                //atualizar lista de contatos
                getContatos();
            }).fail(function(jqXHR, textStatus, msg){
                alert("Erro ao excluir contato: " + msg)
            });
        }
    })

    // Filtrando contatos
    $("#btnBuscaContato").click(function(){
        let linhasFiltradas = "";
        let valorBusca = $("#inputBusca").val().toUpperCase();

        // Caso não exista valor na busca, refazer o get e voltar com o agrupamento
        if(!valorBusca){
            $("#tableContatos tbody").html("");
            getContatos();
            return;
        }

        // Ordenando contatos
        contatos.sort(compararContatos);

        contatos.forEach(element =>{
            if(element.nome.toUpperCase().indexOf(valorBusca) != -1)
                linhasFiltradas += 
                    "<tr data-id=" + element._id + " class='linhaTabelaContatos'>" +
                        "<td>"+ element.nome + "</td>" +
                        "<td class='btnTableExcluir'>Excluir</td>" +
                    "</tr>";
        })
        $("#tableContatos tbody").html(linhasFiltradas);
        
    })

    // Função para ordenar lista de contatos
    function compararContatos(a, b){
        const nomeA = a.nome;
        const nomeB = b.nome;

        let comparacao = 0;
        if (nomeA > nomeB)
            comparacao = 1
        else if (nomeA < nomeB)
            comparacao = -1

        return comparacao;
    }

    //Abrir tela de cadastro
    $("#btnOpenCadastro").click(function(){
        $("#containerLogin").hide();
        $("#containerCadastro").show();
    })

    //Cancelar cadastro
    $("#btnCancelarCadastro").click(function(){
        $("#containerCadastro").hide();
        $("#containerLogin").show();
    })

    //Cadastrar usuário
    $("#formCadastro").submit(function(event){
        let usuario = {
            nome: $("#inputNomeCadastro").val(),
            email: $("#inputEmail").val(),
            senha: $("#inputSenha").val()
        }

        if(usuario.senha != $("#inputConfirmarSenha").val()){
            alert("Senhas não conferem");
            event.preventDefault();
            return;
        }

        $.ajax({
            url: "http://localhost:3000/usuario",
            type: 'POST',
            data: usuario
        }).done(function(){
            alert("Cadastro efetuado com sucesso")
        }).fail(function(jqXHR, textStatus, msg){
            alert("Erro ao cadastrar: " + msg)
        });
        
    })

    //Login usuário
    $("#formLogin").submit(function(event){
        event.preventDefault();

        let usuario = {
            email: $("#inputEmailLogin").val(),
            senha: $("#inputSenhaLogin").val()
        }

        $.ajax({
            url: "http://localhost:3000/usuario/login",
            type: 'POST',
            data: usuario
        }).done(function(result){
            window.localStorage.setItem('idUsuarioLogado', result)
            $("#containerLogin").hide();
            getContatos();
        }).fail(function(jqXHR, textStatus, msg){
            alert("Erro ao cadastrar: " + msg)
        });
    })

    function redirectToLogin(){
        alert("Você não está logado");
        //Redirecionando para login
        $("#containerContatos").hide();
        $("#containerCadastroContato").hide();
        $("#containerCadastro").hide();
        $("#containerLogin").show();
    }

    function redirectToContacts(){
        if(window.localStorage.getItem('idUsuarioLogado')){
            $("#containerLogin").hide();
            getContatos();
        }
    }
    redirectToContacts();

    $("#btnLogOut").click(function(){
        window.localStorage.removeItem('idUsuarioLogado');
        $("#containerContatos").hide();
        $("#containerLogin").show();
    })

})