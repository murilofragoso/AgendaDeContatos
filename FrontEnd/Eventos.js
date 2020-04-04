$(document).ready(function () {
    $("#btnNovoContato").click(function(){
        $("#containerContatos").hide();
        $("#containerCadastroContato").show();
    })

    $("#addTelefone").click(function(){
        let numeroTelefone = $("#inputTelefone").val();
        if(!numeroTelefone){
            alert("Adicione um número de telefone!");
            return;
        }else if(isNaN(numeroTelefone)){
            alert("O telefone deve conter apenas números")
            return;
        }else if(numeroTelefone.toString().length < 9){
            alert("O telefone deve possuir no mínimo 9 dígitos");
            return;
        }
        $("#tableNovoContatoTelefones").show();
        $("#tableNovoContatoTelefones tbody").append("<tr><td>"+ numeroTelefone + "</td><td class='btnTableExcluir'>Excluir</td></tr>")
        $("#inputTelefone").val("").focus();
    })

    $("#tableNovoContatoTelefones").on("click", ".btnTableExcluir", function(){
        if(confirm("Deseja excluir esse telefone?")){
            $(this).closest('tr').remove();
        }
        if($("#tableNovoContatoTelefones tbody td").length == 0)
        $("#tableNovoContatoTelefones").hide();
    })
})