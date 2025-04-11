// script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('gasto-form');
  const listaGastos = document.getElementById('lista-gastos');
  const filterMonth = document.getElementById('filter-month');
  const totalGeral = document.getElementById('total-geral');
  const monthlyTotal = document.getElementById('monthly-total');
  const limparTudoBtn = document.getElementById('limpar-tudo');
  const exportBtn = document.getElementById('export-btn');
  const somDinheiro = document.getElementById('somDinheiro');

  let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

  // Função para formatar valor em reais
  const formatarMoeda = (valor) => {
      return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  // Função para atualizar os totais
  const atualizarTotais = () => {
      const total = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
      totalGeral.textContent = formatarMoeda(total);

      const mesSelecionado = filterMonth.value;
      const gastosFiltrados = mesSelecionado === 'todos' 
          ? gastos 
          : gastos.filter(g => g.mes === mesSelecionado);
      const totalMensal = gastosFiltrados.reduce((sum, gasto) => sum + gasto.valor, 0);
      monthlyTotal.textContent = formatarMoeda(totalMensal);
  };

  // Função para renderizar a lista de gastos
  const renderizarGastos = () => {
      listaGastos.innerHTML = '';
      const mesSelecionado = filterMonth.value;
      const gastosFiltrados = mesSelecionado === 'todos' 
          ? gastos 
          : gastos.filter(g => g.mes === mesSelecionado);

      if (gastosFiltrados.length === 0) {
          listaGastos.innerHTML = '<li class="no-expenses">Nenhum gasto registrado ainda.</li>';
          return;
      }

      gastosFiltrados.forEach((gasto, index) => {
          const li = document.createElement('li');
          li.className = 'expense-item';
          li.innerHTML = `
              <div class="expense-category">
                  <i class="fas fa-${getIconeCategoria(gasto.categoria)}"></i>
              </div>
              <div class="expense-details">
                  <span class="expense-description">${gasto.descricao || gasto.categoria}</span>
                  <span class="expense-date">${gasto.mes}</span>
              </div>
              <span class="expense-value">${formatarMoeda(gasto.valor)}</span>
              <button class="delete-btn" data-index="${index}">
                  <i class="fas fa-trash"></i>
              </button>
          `;
          listaGastos.appendChild(li);
      });

      atualizarTotais();
  };

  // Função para obter ícone baseado na categoria
  const getIconeCategoria = (categoria) => {
      const icones = {
          'Alimentação': 'utensils',
          'Transporte': 'car',
          'Lazer': 'gamepad',
          'Moradia': 'home',
          'Saúde': 'heartbeat',
          'Outros': 'ellipsis-h'
      };
      return icones[categoria] || 'money-bill';
  };

  // Adicionar novo gasto
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const novoGasto = {
          mes: document.getElementById('mes').value,
          categoria: document.getElementById('categoria').value,
          valor: parseFloat(document.getElementById('valor').value),
          descricao: document.getElementById('descricao').value
      };

      gastos.push(novoGasto);
      localStorage.setItem('gastos', JSON.stringify(gastos));
      
      somDinheiro.play().catch(err => console.log('Erro ao tocar som:', err));
      form.reset();
      renderizarGastos();
  });

  // Filtrar por mês
  filterMonth.addEventListener('change', renderizarGastos);

  // Deletar gasto individual
  listaGastos.addEventListener('click', (e) => {
      if (e.target.closest('.delete-btn')) {
          const index = parseInt(e.target.closest('.delete-btn').dataset.index);
          gastos.splice(index, 1);
          localStorage.setItem('gastos', JSON.stringify(gastos));
          renderizarGastos();
      }
  });

  // Limpar todos os gastos
  limparTudoBtn.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja apagar todos os gastos?')) {
          gastos = [];
          localStorage.removeItem('gastos');
          renderizarGastos();
      }
  });

  // Exportar dados
  exportBtn.addEventListener('click', () => {
      const dadosExport = gastos.map(g => ({
          Mês: g.mes,
          Categoria: g.categoria,
          Valor: formatarMoeda(g.valor),
          Descrição: g.descricao || '-'
      }));
      
      const csv = [
          ['Mês', 'Categoria', 'Valor', 'Descrição'],
          ...dadosExport.map(g => [g.Mês, g.Categoria, g.Valor, g.Descrição])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gastos.csv';
      a.click();
      window.URL.revokeObjectURL(url);
  });

  // Inicialização
  renderizarGastos();
});