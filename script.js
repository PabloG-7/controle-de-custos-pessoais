// Armazena os gastos organizados por mês
const gastosPorMes = {};
const totalGeralElement = document.getElementById("total-geral");
const listaGastosElement = document.getElementById("lista-gastos");

// Função para adicionar um gasto
function adicionarGasto() {
  const mes = document.getElementById("mes").value;
  const categoria = document.getElementById("categoria").value.trim();
  const valor = parseFloat(document.getElementById("valor").value);

  if (!mes || !categoria || isNaN(valor)) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  // Verifica se já existe um array para o mês, se não, cria um
  if (!gastosPorMes[mes]) {
    gastosPorMes[mes] = [];
  }

  // Adiciona o gasto ao mês
  gastosPorMes[mes].push({ categoria, valor });

  // Atualiza a interface
  atualizarListaGastos();
  atualizarTotalGeral();

  // Limpa os campos do formulário
  document.getElementById("categoria").value = "";
  document.getElementById("valor").value = "";
}

// Função para atualizar a lista de gastos por mês
function atualizarListaGastos() {
  listaGastosElement.innerHTML = ""; // Limpa a lista anterior

  for (const mes in gastosPorMes) {
    // Calcula o total do mês
    const totalDoMes = gastosPorMes[mes].reduce((sum, gasto) => sum + gasto.valor, 0);

    // Cria o elemento da lista do mês
    const li = document.createElement("li");
    li.innerHTML = `<strong style="color: #3e006b;">${mes}</strong>: Total R$ ${totalDoMes.toFixed(2)}`;

    // Adiciona os gastos individuais do mês
    const ulSubGastos = document.createElement("ul");
    gastosPorMes[mes].forEach((gasto) => {
      const subItem = document.createElement("li");
      subItem.textContent = `${gasto.categoria}: R$ ${gasto.valor.toFixed(2)}`;
      ulSubGastos.appendChild(subItem);
    });

    li.appendChild(ulSubGastos);
    listaGastosElement.appendChild(li);
  }
}

// Função para atualizar o total geral
function atualizarTotalGeral() {
  const total = Object.values(gastosPorMes)
    .flat()
    .reduce((sum, gasto) => sum + gasto.valor, 0);
  totalGeralElement.textContent = `R$ ${total.toFixed(2)}`;
}