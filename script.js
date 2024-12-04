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
    gastosPorMes[mes].forEach((gasto, index) => {
      const subItem = document.createElement("li");
      subItem.innerHTML = `
        ${gasto.categoria}: R$ ${gasto.valor.toFixed(2)} 
        <button onclick="apagarGasto('${mes}', ${index})" class="delete-btn">Apagar</button>
      `;
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

// Função para apagar um gasto específico
function apagarGasto(mes, index) {
  gastosPorMes[mes].splice(index, 1); // Remove o gasto pelo índice

  // Se não houver mais gastos no mês, remove o mês
  if (gastosPorMes[mes].length === 0) {
    delete gastosPorMes[mes];
  }

  // Atualiza a interface
  atualizarListaGastos();
  atualizarTotalGeral();
}

// Função para apagar todos os gastos
function apagarTodosGastos() {
  for (const mes in gastosPorMes) {
    delete gastosPorMes[mes];
  }

  // Atualiza a interface
  atualizarListaGastos();
  atualizarTotalGeral();
}