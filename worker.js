self.onmessage = (array) => {

    let elementos = array.data[0];
    let ids = [];
    let j = 0;

    check = array.data[1];

    for(i = 0; i < 10; i++){
        ids[i] = elementos[j];
        j += 2;
    }

    while(true){
        let produtoComprado =  ids[geraNumeroAleatorio(0, 10)]; 
        let index = elementos.indexOf(produtoComprado);

        let quantidadeComprada = geraNumeroAleatorio(1, 2);
        let quantidadeEstoque = elementos[index+1];

        if(quantidadeComprada <= quantidadeEstoque){
            let deveRealizarCompra = geraNumeroAleatorio(0, 2);
            if(deveRealizarCompra === 1){
                Atomics.wait(check, 0, 1); 
                Atomics.notify(check, 0, 0);
                Atomics.add(check, 0, 1);
                console.log(check[0], 'c2')
                quantidadeEstoque = elementos[index+1];
                if(quantidadeComprada <= quantidadeEstoque){
                    console.log('Index do elemento comprado: ', index, 'Quantidade antes da compra: ', elementos[index+1])
                    Atomics.sub(elementos, index+1, quantidadeComprada);
                    Atomics.sub(check, 0, 1);
                    console.log('Index do elemento comprado: ', index, 'Quantidade depois da compra: ', elementos[index+1])
                }
            } else {
                console.log('Escolhi não comprar!!');
            }
            console.log('Index do elemento comprado: ', index, 'Quantidade antes da compra: ', elementos[index+1])
            console.log('Index do elemento comprado: ', index, 'Quantidade depois da compra: ', elementos[index+1])
        } else {
                console.log('Estoque insuficiente!');
        }
    }
};

function geraNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


