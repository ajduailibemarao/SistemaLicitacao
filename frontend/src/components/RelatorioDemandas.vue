<!-- src/components/relatorios/RelatorioDemandas.vue -->
<template>
    <div class="relatorio-demandas">
      <div class="page-header">
        <h3>Relatório de Demandas por Diretoria</h3>
      </div>
      
      <div class="filters">
        <div class="filter-group">
          <label for="ano">Ano:</label>
          <select id="ano" v-model="filtroAno" class="form-control" @change="carregarDados">
            <option value="">Todos os anos</option>
            <option v-for="ano in anos" :key="ano" :value="ano">{{ ano }}</option>
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
        <div class="chart-container">
          <h4>Distribuição de Licitações por Diretoria</h4>
          <canvas ref="chartDiretorias"></canvas>
        </div>
        
        <div class="chart-container">
          <h4>Valores por Diretoria</h4>
          <canvas ref="chartValores"></canvas>
        </div>
        
        <div class="table-responsive">
          <table class="table relatorio-table">
            <thead>
              <tr>
                <th>Diretoria</th>
                <th>Total de Licitações</th>
                <th>Adjudicadas</th>
                <th>Em Andamento</th>
                <th>Valor Estimado</th>
                <th>Valor Adjudicado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in dados" :key="index">
                <td>{{ item.diretoria }}</td>
                <td>{{ item.total_licitacoes }}</td>
                <td>{{ item.adjudicadas }}</td>
                <td>{{ item.em_andamento }}</td>
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
                <th>{{ formatarMoeda(totalValorEstimado) }}</th>
                <th>{{ formatarMoeda(totalValorAdjudicado) }}</th>
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
    name: 'RelatorioDemandas',
    data() {
      return {
        dados: [],
        anos: [],
        filtroAno: '',
        carregando: true,
        chartDiretorias: null,
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
      totalValorEstimado() {
        return this.dados.reduce((total, item) => total + parseFloat(item.valor_estimado_total || 0), 0);
      },
      totalValorAdjudicado() {
        return this.dados.reduce((total, item) => total + parseFloat(item.valor_adjudicado_total || 0), 0);
      }
    },
    mounted() {
      this.carregarAnos();
      this.carregarDados();
    },
    methods: {
      async carregarAnos() {
        try {
          const response = await axios.get('/api/relatorios/anos');
          this.anos = response.data;
        } catch (error) {
          console.error('Erro ao carregar anos:', error);
        }
      },
      
      async carregarDados() {
        try {
          this.carregando = true;
          
          let url = '/api/relatorios/demandas';
          const params = {};
          
          if (this.filtroAno) {
            params.ano = this.filtroAno;
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
        this.renderizarGraficoDiretorias();
        this.renderizarGraficoValores();
      },
      
      renderizarGraficoDiretorias() {
        if (this.chartDiretorias) {
          this.chartDiretorias.destroy();
        }
        
        const ctx = this.$refs.chartDiretorias.getContext('2d');
        
        const labels = this.dados.map(item => item.diretoria);
        const totalLicitacoes = this.dados.map(item => parseInt(item.total_licitacoes));
        
        this.chartDiretorias = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Total de Licitações',
                data: totalLicitacoes,
                backgroundColor: '#2196F3'
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
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
        
        const labels = this.dados.map(item => item.diretoria);
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
      
      formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(valor);
      },
      
      async exportarExcel() {
        try {
          let url = '/api/exportacao/relatorios/demandas/excel';
          window.open(`${url}?ano=${this.filtroAno || ''}`, '_blank');
        } catch (error) {
          console.error('Erro ao exportar para Excel:', error);
          alert('Erro ao exportar dados. Por favor, tente novamente.');
        }
      },
      
      async exportarPDF() {
        try {
          let url = '/api/exportacao/relatorios/demandas/pdf';
          window.open(`${url}?ano=${this.filtroAno || ''}`, '_blank');
        } catch (error) {
          console.error('Erro ao exportar para PDF:', error);
          alert('Erro ao exportar dados. Por favor, tente novamente.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .relatorio-demandas {
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
    text-align: center;
  }
  
  canvas {
    width: 100%;
    height: 300px;
  }
  
  .relatorio-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 30px;
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
  }
  </style>