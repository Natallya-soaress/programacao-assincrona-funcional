let datatableCompra = $("#tabela-compra");
let datatablePesquisa = $("#tabela-pesquisa");

let elementosComprados = [];
let paginaAtual = 0;
let pesquisaAtual = '';

datatablePesquisa.DataTable({
    paging: false,
    dom: 'Bfrtip',
    select: true,
    buttons: [
        {
            text: 'Selecionar tudo',
            action: function () {
                datatablePesquisa.DataTable().rows().select();
            }
        },
        {
            text: 'Deselecionar tudo',
            action: function () {
                datatablePesquisa.DataTable().rows().deselect();
            }
        },
        {
            text: 'Anterior',
            action: function () {
                preencherTabelaPesquisa($("#produto").val().toString(), -1)
            }
        },
        {
            text: 'Proximo',
            action: function () {
                preencherTabelaPesquisa($("#produto").val().toString(), 1)
            }
        }
    ]
});

function alteraPagina(pagina, pesquisa) {
    pesquisaAtual === pesquisa ? paginaAtual += pagina : paginaAtual = 1;
    pesquisaAtual = pesquisa;
}

function preecherCompra() {

    let novosDados = datatablePesquisa.DataTable().rows({ selected: true }).data();

    if (!novosDados.length)
        return;

    let dadosTabelaPesquisa = datatablePesquisa.DataTable().rows().data();

    datatablePesquisa.DataTable().rows().remove();

    for (let i = 0; i < dadosTabelaPesquisa.length; i++) {
        for (let j = 0; j < novosDados.length; j++) {
            if (dadosTabelaPesquisa[i][0].toString() == novosDados[j][0].toString()) {
                if (parseInt(dadosTabelaPesquisa[i][2]) > 0) {
                    dadosTabelaPesquisa[i][2] = parseInt(dadosTabelaPesquisa[i][2]) - 1;
                    datatableCompra.DataTable().row.add([novosDados[j][0], novosDados[j][1]]).draw();
                    elementosComprados.push(novosDados[j]);
                } else {
                    alert('Estoque insuficiente!');
                }
            }
        }
        datatablePesquisa.DataTable().row.add(dadosTabelaPesquisa[i]).draw();
    }
}

async function realizaRequisicao(url) {

    const cabecalhoRequisicao = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '3dbdb6e8b2msh15c93851be18bdfp178926jsn1da924233b9a',
            'X-RapidAPI-Host': 'unofficial-shein.p.rapidapi.com'
        }
    };

    let response = await fetch(url, cabecalhoRequisicao);
    let data = await response.json();
    return data;
}

async function preencherTabelaPesquisa(produto = '', page = 1, limit = 10) {


    datatablePesquisa.DataTable().rows().remove();

    if (produto.trim() == "")
        return

    alteraPagina(page, produto);

    let url = `https://unofficial-shein.p.rapidapi.com/products/search?keywords=${produto}&language=pt&sort=7&limit=${limit}&page=${paginaAtual}`;
    console.log(url)

    let dados = await realizaRequisicao(url);
    produtos = dados['info']['products'];

    if (produtos.length == 0) {
        alert('Nenhum produto foi encontrado!');
    } else {
        preencherTabelaRec(produtos)
    }
}

function preencherTabelaRec(produtos) {
    if (!!produtos.length) {
        p = produtos.shift()
        datatablePesquisa.DataTable().row.add([p["goods_name"], p["retailPrice"]["amountWithSymbol"], 10]).draw();
        preencherTabelaRec(produtos)
    }
    return
}