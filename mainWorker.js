const produtos = ['shoes', 'pants', 'shirts', 'purse', 'boots', 'jacket', 'shorts', 'bikini', 'skirt', 'overalls'];
const cabecalhoRequisicao = {
    method: 'GET',
    headers: {
		'X-RapidAPI-Key': '3dbdb6e8b2msh15c93851be18bdfp178926jsn1da924233b9a',
		'X-RapidAPI-Host': 'unofficial-shein.p.rapidapi.com'
	}
};

let numeroWorkers = 4;
let workers = [];

let posicao = geraNumeroAleatorio(0, 10);
let produto = produtos[posicao];
let url = `https://unofficial-shein.p.rapidapi.com/products/search?keywords=${produto}&language=pt&sort=7&limit=10&page=1`;

const buffer = new SharedArrayBuffer(1024);
const elementos = new Int32Array(buffer);

const sab = new SharedArrayBuffer(1024);
const checagem = new Int32Array(sab);

checagem[0] = 0;

inicializaBuffer();

async function inicializaBuffer(){

    let arrayProduto = await fazRequisicao(url);

    for(i = 0; i < numeroWorkers; i++){
        workers[i] = new Worker('worker.js');
    }

    let j =0;

    for(i = 0; i < arrayProduto.length; i++){
        elementos[j] = arrayProduto[i][0];
        elementos[j+1] = arrayProduto[i][1];
        j+= 2;
    }

    for(i = 0; i < numeroWorkers; i++){
        workers[i].postMessage([elementos, checagem]);
    }
}

async function fazRequisicao(url){

    let arrayProduto = [];
    let dados = await realizaRequisicao(url, cabecalhoRequisicao);
    let arrayProducts = dados['info']['products'];

    for (let i = 0; i < arrayProducts.length; i++) {
        arrayProduto[i] = [arrayProducts[i]["goods_id"], 10];
    }

    return arrayProduto;
}

async function realizaRequisicao(url, cabecalhoRequisicao) {
    let response = await fetch(url, cabecalhoRequisicao);
    let data = await response.json();
    return data;
}

function geraNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

