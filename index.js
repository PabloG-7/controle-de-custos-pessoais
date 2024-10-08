let total = 0;
let despesas = {};

function adicionarGasto() {
    const categoria = document.getElementById('categoria').value;
    const valor = parseFloat(document.getElementById('valor').value);

    if (categoria && !isNaN(valor)) {
        const listaGastos = document.getElementById('listaGastos');
        const novoGasto = document.createElement('li');
        novoGasto.textContent = `${categoria}: R$ ${valor.toFixed(2)}`;
        listaGastos.appendChild(novoGasto);

        
        total += valor;
        document.getElementById('totalGastos').textContent = total.toFixed(2);
        
        document.getElementById('categoria').value = '';
        document.getElementById('valor').value = '';

    } else {
        alert('Preencha todos os campos corretamente.');
    }
}