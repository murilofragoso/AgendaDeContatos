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
        let linhaEndereco = 
        "<tr>" +
            "<td>"+ $("#inputCep").val() + "</td>" +
            "<td>"+ $("#inputLogradouro").val() + "</td>" +
            "<td>"+ $("#inputNumero").val() + "</td>" +
            "<td>"+ $("#inputBairro").val() + "</td>" +
            "<td>"+ $("#inputComp").val() + "</td>" +
            "<td>"+ $("#inputCidade").val() + "</td>" +
            "<td>"+ $("#inputUF").val() + "</td>" +
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
})