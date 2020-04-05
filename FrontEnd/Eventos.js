$(document).ready(function () {
    // Abrir tela de cadastr de contato
    $("#btnNovoContato").click(function(){
        $("#containerContatos").hide();
        $("#containerCadastroContato").show();
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

        // Validando tamanho do cep
        if(cep.length != 8){
            alert("CEP deve possuir 8 dígitos")
            return;
        }else if(isNaN(cep)){
            alert("CEP deve possuir apenas números")
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

    $("#formCadastroContato").submit(function(event){
        //Verificando se existe algum telefone pendende te cadastro
        if($("#inputTelefone").val()){
            alert("Para cadastrar um telefone, clique em 'Cadastrar Telefone'");
            event.preventDefault();
            return;
        }

        //Verificando se existe algum endereço pendente de cadastro
        if( $("#inputCep").val() || $("#inputLogradouro").val() || $("#inputNumero").val() || $("#inputBairro").val() ||
            $("#inputComp").val() || $("#inputCidade").val() || $("#inputUF").val()){
            alert("Para cadastrar um endereço, clique em 'Cadastrar Endereço'");
            event.preventDefault();
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
            enderecos: JSON.stringify(end)
        }
        
        $.ajax({
            url: "http://localhost:3000/contato",
            type: 'post',
            data: contato
        }).done(function(retorno){
            //atualizar lista de contatos
            console.log(retorno)
        }).fail(function(jqXHR, textStatus, msg){
            alert("Erro ao salvar contato: " + msg)
        });
    })
})