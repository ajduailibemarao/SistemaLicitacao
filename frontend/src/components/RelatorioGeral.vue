// frontend/src/components/relatorios/RelatorioGeral.vue
<template>
  <div class="relatorio-geral">
    <div class="page-header">
      <h3>Relatório Geral de Licitações</h3>
    </div>
    
    <div class="filters">
      <div class="filter-group">
        <label for="ano">Ano:</label>
        <select id="ano" v-model="filtroAno" class="form-control" @change="carregarDados">
          <option value="">Todos os anos</option>
          <option v-for="ano in anos" :key="ano" :value="ano">{{ ano }}</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="mes">Mês:</label>
        <select id="mes" v-model="filtroMes" class="form-control" @change="carregarDados">
          <option value="">Todos os meses</option>
          <option value="1">Janeiro</option>
          <option value="2">Fevereiro</option>
          <option value="3">Março</option>
          <option value="4">Abril</option>
          <option value="5">Maio</option>
          <option value="6">Junho</option>
          <option value="7">Julho</option>
          <option value="8">Agosto</option>
          <option value="9">Setembro</option>
          <option value="10">Outubro</option>
          <option value="11">Novembro</option>
          <option value="12">Dezembro</option>
        </select>
      </div>
      
      <div class="filter-actions">
        <button class="btn btn-export" @click="exportarExcel">
          <i class="fas fa-file-excel"></i> Exportar para Excel
        </button>
        <button class="btn btn-export" @click="exportarPDF">
          <i class="fas fa-file-pdf"></i> Exportar para PDF
        </button>
      </div>
    </div>
    
    <div v-if="carregando" class="loading">
      Carregando dados...
    </div>
    
    <div v-else-if="dados.length === 0" class="no-data">
      Nenhum dado encontrado para os filtros selecionados.
    </div>
    
    <div v-else>
      <div class="resumo-cards">
        <div class="card">
          <div class="card-title">Total de Licitações</div>
          <div class="card-value">{{ totalLicitacoes }}</div>
        </div>
        
        <div class="card">
          <div class="card-title">Licitações Adjudicadas</div>
          <div class="card-value">{{ totalAdjudicadas }}</div>
          <div class="card-percent">{{ percentualAdjudicadas }}%</div>
        </div>
        
        <div class="card">
          <div class="card-title">Valor Estimado Total</div>
          <div class="card-value">{{ formatarMoeda(totalValorEstimado) }}</div>
        </div>
        
        <div class="card">
          <div class="card-title">Valor Adjudicado Total</div>
          <div class="card-value">{{ formatarMoeda(totalValorAdjudicado) }}</div>
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="table relatorio-table">
          <thead>
            <tr>
              <th>Período</th>
              <th>Total de Licitações</th>
              <th>Adjudicadas</th>
              <th>Em Andamento</th>
              <th>Outras Situações</th>
              <th>Valor Estimado</th>
              <th>Valor Adjudicado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in dados" :key="index">
              <td>{{ getNomeMes(item.mes) }}/{{ item.ano }}</td>
              <td>{{ item.total_licitacoes }}</td>
              <td>{{ item.adjudicadas }}</td>
              <td>{{ item.em_andamento }}</td>
              <td>{{ item.outras }}</td>
              <td>{{ formatarMoeda(item.valor_estimado_total) }}</td>
              <td>{{ formatarMoeda(item.valor_adjudicado_total) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>{{ totalLicitacoes }}</th>
              <th>{{ totalAdjudicadas }}</th>
              <th>{{ totalEmAndamento }}</th>
              <th>{{ totalOutras }}</th>
              <th>{{ formatarMoeda(totalValorEstimado) }}</th>
              <th>{{ formatarMoeda(totalValorAdjudicado) }}</th>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div class="chart-container">
        <h4>Distribuição de Licitações por Status</h4>
        <canvas ref="chartStatus"></canvas>
      </div>
      
      <div class="chart-container">
        <h4>Evolução de Valores por Período</h4>
        <canvas ref="chartValores"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  name: 'RelatorioGeral',
  data() {
    return {
      dados: [],
      anos: [],
      filtroAno: '',
      filtroMes: '',
      carregando: true,
      chartStatus: null,
      chartValores: null
    };
  },
  computed: {
    totalLicitacoes() {
      return this.dados.reduce((total, item) => total + parseInt(item.total_licitacoes), 0);
    },
    totalAdjudicadas() {
      return this.dados.reduce((total, item) => total + parseInt(item.adjudicadas), 0);
    },
    totalEmAndamento() {
      return this.dados.reduce((total, item) => total + parseInt(item.em_andamento), 0);
    },
    totalOutras() {
      return this.dados.reduce((total, item) => total + parseInt(item.outras), 0);
    },
    totalValorEstimado() {
      return this.dados.reduce((total, item) => total + parseFloat(item.valor_estimado_total || 0), 0);
    },
    totalValorAdjudicado() {
      return this.dados.reduce((total, item) => total + parseFloat(item.valor_adjudicado_total || 0), 0);
    },
    percentualAdjudicadas() {
      if (this.totalLicitacoes === 0) return 0;
      return ((this.totalAdjudicadas / this.totalLicitacoes) * 100).toFixed(1);
    }
  },
  mounted() {
    this.carregarAnos();
    this.carregarDados();
  },
  methods: {
    async carregarAnos() {
      try {
        const response = await axios.get('/api/licitacoes/anos');
        this.anos = response.data;
      } catch (error) {
        console.error('Erro ao carregar anos:', error);
      }
    },
    
    async carregarDados() {
      try {
        this.carregando = true;
        
        let url = '/api/relatorios/geral';
        const params = {};
        
        if (this.filtroAno) {
          params.ano = this.filtroAno;
        }
        
        if (this.filtroMes) {
          params.mes = this.filtroMes;
        }
        
        const response = await axios.get(url, { params });
        this.dados = response.data;
        
        this.$nextTick(() => {
          this.renderizarGraficos();
        });
      } catch (error) {
        console.error('Erro ao carregar dados do relatório:', error);
      } finally {
        this.carregando = false;
      }
    },
    
    renderizarGraficos() {
      this.renderizarGraficoStatus();
      this.renderizarGraficoValores();
    },
    
    renderizarGraficoStatus() {
      if (this.chartStatus) {
        this.chartStatus.destroy();
      }
      
      const ctx = this.$refs.chartStatus.getContext('2d');
      
      this.chartStatus = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Adjudicadas', 'Em Andamento', 'Outras Situações'],
          datasets: [{
            data: [this.totalAdjudicadas, this.totalEmAndamento, this.totalOutras],
            backgroundColor: ['#4CAF50', '#2196F3', '#FFC107']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right'
            }
          }
        }
      });
    },
    
    renderizarGraficoValores() {
      if (this.chartValores) {
        this.chartValores.destroy();
      }
      
      const ctx = this.$refs.chartValores.getContext('2d');
      
      const labels = this.dados.map(item => `${this.getNomeMes(item.mes)}/${item.ano}`);
      const valoresEstimados = this.dados.map(item => parseFloat(item.valor_estimado_total || 0));
      const valoresAdjudicados = this.dados.map(item => parseFloat(item.valor_adjudicado_total || 0));
      
      this.chartValores = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Valor Estimado',
              data: valoresEstimados,
              backgroundColor: '#2196F3'
            },
            {
              label: 'Valor Adjudicado',
              data: valoresAdjudicados,
              backgroundColor: '#4CAF50'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => this.formatarMoeda(value)
              }
            }
          }
        }
      });
    },
    
    getNomeMes(mes) {
      const meses = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ];
      return meses[mes - 1];
    },
    
    formatarMoeda(valor) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(valor);
    },
    
    async exportarExcel() {
      try {
        let url = '/api/exportacao/relatorios/geral/excel';
        const params = {};
        
        if (this.filtroAno) {
          params.ano = this.filtroAno;
        }
        
        if (this.filtroMes) {
          params.mes = this.filtroMes;
        }
        
        window.open(`${url}?ano=${this.filtroAno || ''}&mes=${this.filtroMes || ''}`, '_blank');
      } catch (error) {
        console.error('Erro ao exportar para Excel:', error);
        alert('Erro ao exportar dados. Por favor, tente novamente.');
      }
    },
    
    async exportarPDF() {
      try {
        let url = '/api/exportacao/relatorios/geral/pdf';
        const params = {};
        
        if (this.filtroAno) {
          params.ano = this.filtroAno;
        }
        
        if (this.filtroMes) {
          params.mes = this.filtroMes;
        }
        
        window.open(`${url}?ano=${this.filtroAno || ''}&mes=${this.filtroMes || ''}`, '_blank');
      } catch (error) {
        console.error('Erro ao exportar para PDF:', error);
        alert('Erro ao exportar dados. Por favor, tente novamente.');
      }
    }
  }
};
</script>

<style scoped>
.relatorio-geral {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  margin-bottom: 0;
}

.filter-group select {
  width: 150px;
}

.filter-actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.resumo-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  flex: 1;
  min-width: 200px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.card-percent {
  font-size: 14px;
  color: #4CAF50;
  margin-top: 5px;
}

.chart-container {
  margin-top: 30px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-container h4 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 16px;
}

canvas {
  width: 100%;
  height: 300px;
}

.relatorio-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.relatorio-table th,
.relatorio-table td {
  padding: 12px 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.relatorio-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #555;
}

.relatorio-table tfoot th {
  background-color: #e9e9e9;
}

.relatorio-table tr:hover {
  background-color: #f5f5f5;
}

.no-data {
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #666;
  font-style: italic;
}

.loading {
  text-align: center;
  padding: 30px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-actions {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
  }
  
  .btn-export {
    flex: 1;
  }
  
  .resumo-cards {
    flex-direction: column;
  }
  
  .card {
    width: 100%;
  }
}
</style>