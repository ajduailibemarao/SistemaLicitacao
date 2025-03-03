<!-- src/components/Dashboard.vue -->
<template>
  <div class="dashboard">
    <h2>Dashboard</h2>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando dados...</p>
    </div>
    
    <div v-else>
      <div class="dashboard-cards">
        <div class="card">
          <div class="card-header">
            <h3>Licitações</h3>
          </div>
          <div class="card-body">
            <div class="stat">
              <span class="stat-value">{{ stats.totalLicitacoes }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.licitacoesEmAndamento }}</span>
              <span class="stat-label">Em andamento</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.licitacoesConcluidas }}</span>
              <span class="stat-label">Concluídas</span>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3>Contratações Diretas</h3>
          </div>
          <div class="card-body">
            <div class="stat">
              <span class="stat-value">{{ stats.totalContratacoes }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.contratacoesEmAndamento }}</span>
              <span class="stat-label">Em andamento</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.contratacoesConcluidas }}</span>
              <span class="stat-label">Concluídas</span>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3>Empresas Sancionadas</h3>
          </div>
          <div class="card-body">
            <div class="stat">
              <span class="stat-value">{{ stats.totalPenalidades }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.penalidadesVigentes }}</span>
              <span class="stat-label">Vigentes</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-charts">
        <div class="chart-container">
          <h3>Licitações por Status</h3>
          <div class="chart-wrapper">
            <canvas ref="statusChart"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Valores Adjudicados por Mês</h3>
          <div class="chart-wrapper">
            <canvas ref="valoresChart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="dashboard-tables">
        <div class="table-container">
          <h3>Licitações Recentes</h3>
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Identificação</th>
                <th>Objeto</th>
                <th>Valor Estimado</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="licitacao in licitacoesRecentes" :key="licitacao.id">
                <td>{{ licitacao.identificacao }}</td>
                <td>{{ truncateText(licitacao.objeto, 40) }}</td>
                <td>{{ formatCurrency(licitacao.valor_estimado) }}</td>
                <td>
                  <span :class="'status-badge ' + getStatusClass(licitacao.status)">
                    {{ licitacao.status }}
                  </span>
                </td>
                <td>{{ formatDate(licitacao.data_entrada) }}</td>
              </tr>
              <tr v-if="licitacoesRecentes.length === 0">
                <td colspan="5" class="no-data">Nenhuma licitação recente encontrada</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  name: 'Dashboard',
  data() {
    return {
      loading: true,
      stats: {
        totalLicitacoes: 0,
        licitacoesEmAndamento: 0,
        licitacoesConcluidas: 0,
        totalContratacoes: 0,
        contratacoesEmAndamento: 0,
        contratacoesConcluidas: 0,
        totalPenalidades: 0,
        penalidadesVigentes: 0,
        licitacoesPorStatus: {
          'Em Análise': 0,
          'Aprovada': 0,
          'Rejeitada': 0,
          'Cancelada': 0,
          'Concluída': 0
        },
        valoresPorMes: {
          'Jan': 0,
          'Fev': 0,
          'Mar': 0,
          'Abr': 0,
          'Mai': 0,
          'Jun': 0
        }
      },
      licitacoesRecentes: [],
      statusChart: null,
      valoresChart: null
    };
  },
  async mounted() {
    await this.fetchStats();
    await this.fetchLicitacoesRecentes();
    this.renderCharts();
  },
  beforeUnmount() {
    // Limpar gráficos ao desmontar o componente
    if (this.statusChart) {
      this.statusChart.destroy();
    }
    if (this.valoresChart) {
      this.valoresChart.destroy();
    }
  },
  methods: {
    async fetchStats() {
      try {
        this.loading = true;
        const response = await axios.get('/api/dashboard/stats');
        this.stats = response.data;
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        
        // Dados de exemplo para visualização
        this.stats = {
          totalLicitacoes: 45,
          licitacoesEmAndamento: 12,
          licitacoesConcluidas: 33,
          totalContratacoes: 28,
          contratacoesEmAndamento: 8,
          contratacoesConcluidas: 20,
          totalPenalidades: 15,
          penalidadesVigentes: 7,
          licitacoesPorStatus: {
            'Em Análise': 5,
            'Aprovada': 7,
            'Rejeitada': 10,
            'Cancelada': 8,
            'Concluída': 15
          },
          valoresPorMes: {
            'Jan': 120000,
            'Fev': 180000,
            'Mar': 150000,
            'Abr': 210000,
            'Mai': 190000,
            'Jun': 230000
          }
        };
      } finally {
        this.loading = false;
      }
    },
    
    async fetchLicitacoesRecentes() {
      try {
        const response = await axios.get('/api/licitacoes/recentes');
        this.licitacoesRecentes = response.data;
      } catch (error) {
        console.error('Erro ao buscar licitações recentes:', error);
        // Dados de exemplo
        this.licitacoesRecentes = [
          {
            id: 1,
            identificacao: 'LIC-2023-001',
            objeto: 'Aquisição de equipamentos de informática',
            valor_estimado: 150000,
            status: 'Em Análise',
            data_entrada: '2023-05-15'
          },
          {
            id: 2,
            identificacao: 'LIC-2023-002',
            objeto: 'Contratação de serviços de limpeza',
            valor_estimado: 80000,
            status: 'Aprovada',
            data_entrada: '2023-05-20'
          },
          {
            id: 3,
            identificacao: 'LIC-2023-003',
            objeto: 'Reforma do prédio administrativo',
            valor_estimado: 350000,
            status: 'Concluída',
            data_entrada: '2023-06-01'
          }
        ];
      }
    },
    
    renderCharts() {
      this.renderStatusChart();
      this.renderValoresChart();
    },
    
    renderStatusChart() {
      const ctx = this.$refs.statusChart.getContext('2d');
      const statusData = this.stats.licitacoesPorStatus;
      
      this.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(statusData),
          datasets: [{
            data: Object.values(statusData),
            backgroundColor: [
              '#4CAF50', // Verde
              '#2196F3', // Azul
              '#FFC107', // Amarelo
              '#F44336', // Vermelho
              '#9C27B0'  // Roxo
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 15,
                padding: 15
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    },
    
    renderValoresChart() {
      const ctx = this.$refs.valoresChart.getContext('2d');
      const valoresData = this.stats.valoresPorMes;
      
      this.valoresChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(valoresData),
          datasets: [{
            label: 'Valor Adjudicado',
            data: Object.values(valoresData),
            backgroundColor: '#3498db',
            borderColor: '#2980b9',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => this.formatCurrency(value, false)
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `Valor: ${this.formatCurrency(context.raw)}`;
                }
              }
            }
          }
        }
      });
    },
    
    formatCurrency(value, symbol = true) {
      if (value === undefined || value === null) return '-';
      
      return new Intl.NumberFormat('pt-BR', {
        style: symbol ? 'currency' : 'decimal',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    },
    
    formatDate(dateString) {
      if (!dateString) return '-';
      
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR').format(date);
    },
    
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    
    getStatusClass(status) {
      const statusMap = {
        'Em Análise': 'status-analise',
        'Aprovada': 'status-aprovada',
        'Rejeitada': 'status-rejeitada',
        'Cancelada': 'status-cancelada',
        'Concluída': 'status-concluida',
        'Em andamento': 'status-andamento'
      };
      
      return statusMap[status] || 'status-default';
    }
  }
};
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.card-header {
  background-color: #f8f9fa;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.card-body {
  padding: 20px;
  display: flex;
  justify-content: space-around;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.chart-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart-container h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
  text-align: center;
}

.chart-wrapper {
  height: 300px;
  position: relative;
}

.dashboard-tables {
  margin-top: 30px;
}

.table-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.table-container h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
  text-align: center;
}

.dashboard-table {
  width: 100%;
  border-collapse: collapse;
}

.dashboard-table th,
.dashboard-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.dashboard-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.dashboard-table tr:hover {
  background-color: #f9f9f9;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-analise {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-aprovada {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-andamento {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-concluida {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-rejeitada {
  background-color: #ffebee;
  color: #d32f2f;
}

.status-cancelada {
  background-color: #fbe9e7;
  color: #d84315;
}

.status-default {
  background-color: #f5f5f5;
  color: #616161;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .dashboard-cards {
    grid-template-columns: 1fr;
  }
  
  .dashboard-charts {
    grid-template-columns: 1fr;
  }
  
  .dashboard-table th,
  .dashboard-table td {
    padding: 8px 10px;
    font-size: 14px;
  }
}
</style>