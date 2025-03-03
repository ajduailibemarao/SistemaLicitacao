<!-- src/components/relatorios/RelatorioDetalhamento.vue -->
<template>
    <div class="relatorio-detalhamento">
      <div class="page-header">
        <h3>Relatório Detalhado de Licitações</h3>
      </div>
      
      <div class="filters">
        <div class="filter-group">
          <label for="modalidade">Modalidade:</label>
          <select id="modalidade" v-model="filtroModalidade" class="form-control">
            <option value="">Todas as modalidades</option>
            <option v-for="modalidade in modalidades" :key="modalidade.id" :value="modalidade.id">
              {{ modalidade.nome }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="status">Status:</label>
          <select id="status" v-model="filtroStatus" class="form-control">
            <option value="">Todos os status</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Adjudicada">Adjudicada</option>
            <option value="Suspensa">Suspensa</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Fracassada">Fracassada</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Período:</label>
          <div class="date-range">
            <input type="date" v-model="filtroDataInicio" class="form-control" />
            <span>até</span>
            <input type="date" v-model="filtroDataFim" class="form-control" />
          </div>
        </div>
        
        <div class="filter-actions">
          <button class="btn btn-primary" @click="aplicarFiltros">Aplicar Filtros</button>
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
      
      <div v-else-if="licitacoes.length === 0" class="no-data">
        Nenhuma licitação encontrada para os filtros selecionados.
      </div>
      
      <div v-else>
        <div class="summary-section">
          <h4>Resumo por Status</h4>
          <div class="summary-cards">
            <div class="summary-card" v-for="(count, status) in statusSummary" :key="status">
              <div class="summary-title">{{ status }}</div>
              <div class="summary-value">{{ count }}</div>
              <div class="summary-percent">{{ calcularPercentual(count, licitacoes.length) }}%</div>
            </div>
          </div>
        </div>
        
        <div class="chart-container">
          <h4>Distribuição por Status</h4>
          <canvas ref="chartStatus"></canvas>
        </div>
        
        <div class="table-responsive">
          <table class="table relatorio-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Identificação</th>
                <th>Objeto</th>
                <th>Modalidade</th>
                <th>Data Entrada</th>
                <th>Licitante</th>
                <th>Valor Estimado</th>
                <th>Valor Adjudicado</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="licitacao in licitacoes" :key="licitacao.id">
                <td>{{ licitacao.id }}</td>
                <td>{{ licitacao.identificacao }}</td>
                <td>{{ truncateText(licitacao.objeto, 40) }}</td>
                <td>{{ licitacao.modalidade_nome }}</td>
                <td>{{ formatarData(licitacao.data_entrada) }}</td>
                <td>{{ licitacao.licitante_nome }}</td>
                <td>{{ formatarMoeda(licitacao.valor_estimado) }}</td>
                <td>{{ formatarMoeda(licitacao.valor_adjudicado) }}</td>
                <td>
                  <span :class="'status-badge ' + getStatusClass(licitacao.status)">
                    {{ licitacao.status }}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6"><strong>Total</strong></td>
                <td><strong>{{ formatarMoeda(totalValorEstimado) }}</strong></td>
                <td><strong>{{ formatarMoeda(totalValorAdjudicado) }}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'RelatorioDetalhamento',
    data() {
      return {
        licitacoes: [],
        modalidades: [],
        filtroModalidade: '',
        filtroStatus: '',
        filtroDataInicio: '',
        filtroDataFim: '',
        carregando: true,
        chartStatus: null
      };
    },
    computed: {
      totalValorEstimado() {
        return this.licitacoes.reduce((total, item) => total + parseFloat(item.valor_estimado || 0), 0);
      },
      totalValorAdjudicado() {
        return this.licitacoes.reduce((total, item) => total + parseFloat(item.valor_adjudicado || 0), 0);
      },
      statusSummary() {
        const summary = {};
        this.licitacoes.forEach(licitacao => {
          if (!summary[licitacao.status]) {
            summary[licitacao.status] = 0;
          }
          summary[licitacao.status]++;
        });
        return summary;
      }
    },
    async mounted() {
      await this.carregarModalidades();
      
      // Definir datas padrão (último mês)
      const hoje = new Date();
      const umMesAtras = new Date();
      umMesAtras.setMonth(hoje.getMonth() - 1);
      
      this.filtroDataInicio = umMesAtras.toISOString().split('T')[0];
      this.filtroDataFim = hoje.toISOString().split('T')[0];
      
      await this.carregarLicitacoes();
    },
    methods: {
      async carregarModalidades() {
        try {
          const response = await axios.get('/api/modalidades');
          this.modalidades = response.data;
        } catch (error) {
          console.error('Erro ao carregar modalidades:', error);
        }
      },
      
      async carregarLicitacoes() {
        try {
          this.carregando = true;
          
          const params = {};
          if (this.filtroModalidade) params.modalidade_id = this.filtroModalidade;
          if (this.filtroStatus) params.status = this.filtroStatus;
          if (this.filtroDataInicio) params.data_inicio = this.filtroDataInicio;
          if (this.filtroDataFim) params.data_fim = this.filtroDataFim;
          
          const response = await axios.get('/api/relatorios/detalhamento', { params });
          this.licitacoes = response.data;
          
          this.$nextTick(() => {
            this.renderizarGraficoStatus();
          });
        } catch (error) {
          console.error('Erro ao carregar licitações:', error);
          this.licitacoes = [];
        } finally {
          this.carregando = false;
        }
      },
      
      aplicarFiltros() {
        this.carregarLicitacoes();
      },
      
      renderizarGraficoStatus() {
        if (this.chartStatus) {
          this.chartStatus.destroy();
        }
        
        const ctx = this.$refs.chartStatus.getContext('2d');
        
        const statusLabels = Object.keys(this.statusSummary);
        const statusData = Object.values(this.statusSummary);
        
        // Cores para cada status
        const statusColors = {
          'Em andamento': '#2196F3',
          'Adjudicada': '#4CAF50',
          'Suspensa': '#FFC107',
          'Cancelada': '#F44336',
          'Fracassada': '#9C27B0'
        };
        
        const backgroundColors = statusLabels.map(status => 
          statusColors[status] || '#607D8B' // Cor padrão para status não mapeados
        );
        
        this.chartStatus = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: statusLabels,
            datasets: [{
              data: statusData,
              backgroundColor: backgroundColors
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
      
      formatarData(data) {
        if (!data) return '-';
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR');
      },
      
      formatarMoeda(valor) {
        if (!valor) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(valor);
      },
      
      truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
      },
      
      getStatusClass(status) {
        const statusMap = {
          'Em andamento': 'status-andamento',
          'Adjudicada': 'status-adjudicada',
          'Suspensa': 'status-suspensa',
          'Cancelada': 'status-cancelada',
          'Fracassada': 'status-fracassada'
        };
        
        return statusMap[status] || 'status-default';
      },
      
      calcularPercentual(valor, total) {
        if (total === 0) return 0;
        return ((valor / total) * 100).toFixed(1);
      },
      
      async exportarExcel() {
        try {
          const params = new URLSearchParams();
          if (this.filtroModalidade) params.append('modalidade_id', this.filtroModalidade);
          if (this.filtroStatus) params.append('status', this.filtroStatus);
          if (this.filtroDataInicio) params.append('data_inicio', this.filtroDataInicio);
          if (this.filtroDataFim) params.append('data_fim', this.filtroDataFim);
          
          window.open(`/api/exportacao/relatorios/detalhamento/excel?${params.toString()}`, '_blank');
        } catch (error) {
          console.error('Erro ao exportar para Excel:', error);
          alert('Erro ao exportar dados. Por favor, tente novamente.');
        }
      },
      
      async exportarPDF() {
        try {
          const params = new URLSearchParams();
          if (this.filtroModalidade) params.append('modalidade_id', this.filtroModalidade);
          if (this.filtroStatus) params.append('status', this.filtroStatus);
          if (this.filtroDataInicio) params.append('data_inicio', this.filtroDataInicio);
          if (this.filtroDataFim) params.append('data_fim', this.filtroDataFim);
          
          window.open(`/api/exportacao/relatorios/detalhamento/pdf?${params.toString()}`, '_blank');
        } catch (error) {
          console.error('Erro ao exportar para PDF:', error);
          alert('Erro ao exportar dados. Por favor, tente novamente.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .relatorio-detalhamento {
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
    flex-direction: column;
    min-width: 150px;
  }
  
  .filter-group label {
    margin-bottom: 5px;
    font-weight: 500;
    font-size: 14px;
  }
  
  .date-range {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .date-range span {
    color: #6c757d;
  }
  
  .filter-actions {
    margin-left: auto;
    display: flex;
    gap: 10px;
  }
  
  .summary-section {
    margin-top: 30px;
  }
  
  .summary-section h4 {
    margin-bottom: 15px;
    text-align: center;
  }
  
  .summary-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .summary-card {
    flex: 1;
    min-width: 150px;
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .summary-title {
    font-size: 14px;
    color: #6c757d;
    margin-bottom: 8px;
  }
  
  .summary-value {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .summary-percent {
    font-size: 14px;
    color: #6c757d;
    margin-top: 5px;
  }
  
  .chart-container {
    margin-top: 30px;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .chart-container h4 {
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .relatorio-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .relatorio-table th,
  .relatorio-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .relatorio-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }
  
  .relatorio-table tbody tr:hover {
    background-color: #f5f5f5;
  }
  
  .status-badge {
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
  
  .status-andamento {
    background-color: #e3f2fd;
    color: #1976d2;
  }
  
  .status-adjudicada {
    background-color: #e8f5e9;
    color: #388e3c;
  }
  
  .status-suspensa {
    background-color: #fff8e1;
    color: #ffa000;
  }
  
  .status-cancelada {
    background-color: #ffebee;
    color: #d32f2f;
  }
  
  .status-fracassada {
    background-color: #f3e5f5;
    color: #7b1fa2;
  }
  
  .status-default {
    background-color: #f5f5f5;
    color: #616161;
  }
  
  .loading {
    text-align: center;
    padding: 40px;
    font-style: italic;
    color: #6c757d;
  }
  
  .no-data {
    background-color: #f8f9fa;
    color: #6c757d;
    padding: 30px;
    text-align: center;
    border-radius: 8px;
    font-style: italic;
  }
  
  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
    }
    
    .filter-actions {
      margin-left: 0;
      margin-top: 10px;
      width: 100%;
    }
    
    .summary-cards {
      flex-direction: column;
    }
    
    .summary-card {
      width: 100%;
    }
  }
  </style>