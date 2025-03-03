<!-- src/components/RelatorioForm.vue -->
<template>
    <div class="relatorio-form">
      <h2>Geração de Relatórios</h2>
      
      <div class="form-group">
        <label for="tipoRelatorio">Tipo de Relatório</label>
        <select id="tipoRelatorio" v-model="tipoRelatorio" class="form-control" @change="resetForm">
          <option value="licitacoes">Licitações</option>
          <option value="contratacoes">Contratações Diretas</option>
          <option value="penalidades">Empresas Sancionadas</option>
        </select>
      </div>
      
      <div v-if="tipoRelatorio !== 'penalidades'" class="form-row">
        <div class="form-group col">
          <label for="dataInicio">Data Inicial</label>
          <input 
            type="date" 
            id="dataInicio" 
            v-model="filtros.dataInicio" 
            class="form-control"
          >
        </div>
        
        <div class="form-group col">
          <label for="dataFim">Data Final</label>
          <input 
            type="date" 
            id="dataFim" 
            v-model="filtros.dataFim" 
            class="form-control"
          >
        </div>
      </div>
      
      <div v-if="tipoRelatorio === 'penalidades'" class="form-group">
        <label>
          <input type="checkbox" v-model="filtros.vigentes"> 
          Mostrar apenas sanções vigentes
        </label>
      </div>
      
      <div class="form-actions">
        <button @click="gerarRelatorio" class="btn btn-primary">Gerar Relatório</button>
        <div class="export-options">
          <button @click="exportarExcel" class="btn btn-success" :disabled="!dadosRelatorio.length">
            <i class="fas fa-file-excel"></i> Excel
          </button>
          <button @click="exportarPDF" class="btn btn-danger" :disabled="!dadosRelatorio.length">
            <i class="fas fa-file-pdf"></i> PDF
          </button>
          <button @click="exportarWord" class="btn btn-info" :disabled="!dadosRelatorio.length">
            <i class="fas fa-file-word"></i> Word
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="loading">
        Carregando dados do relatório...
      </div>
      
      <div v-else-if="dadosRelatorio.length === 0 && relatorioGerado" class="no-results">
        Nenhum resultado encontrado para os filtros selecionados.
      </div>
      
      <div v-else-if="dadosRelatorio.length > 0" class="relatorio-results">
        <h3>Resultados do Relatório</h3>
        
        <!-- Tabela para Licitações -->
        <table v-if="tipoRelatorio === 'licitacoes'" class="relatorio-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Identificação</th>
              <th>Data</th>
              <th>Licitante</th>
              <th>Modalidade</th>
              <th>Valor Estimado</th>
              <th>Valor Adjudicado</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dadosRelatorio" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.identificacao }}</td>
              <td>{{ formatDate(item.data_entrada) }}</td>
              <td>{{ item.licitante_nome }}</td>
              <td>{{ item.modalidade_nome }}</td>
              <td>{{ formatCurrency(item.valor_estimado) }}</td>
              <td>{{ formatCurrency(item.valor_adjudicacao) }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Tabela para Contratações Diretas -->
        <table v-if="tipoRelatorio === 'contratacoes'" class="relatorio-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Identificação</th>
              <th>Data</th>
              <th>Licitante</th>
              <th>Modalidade</th>
              <th>Valor Estimado</th>
              <th>Valor Adjudicado</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dadosRelatorio" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.identificacao_dispensa }}</td>
              <td>{{ formatDate(item.data_entrada) }}</td>
              <td>{{ item.licitante_nome }}</td>
              <td>{{ item.modalidade_nome }}</td>
              <td>{{ formatCurrency(item.valor_estimado) }}</td>
              <td>{{ formatCurrency(item.valor_adjudicado) }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Tabela para Empresas Sancionadas -->
        <table v-if="tipoRelatorio === 'penalidades'" class="relatorio-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Empresa</th>
              <th>CNPJ</th>
              <th>Tipo de Sanção</th>
              <th>Data Início</th>
              <th>Data Término</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dadosRelatorio" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.licitante_nome }}</td>
              <td>{{ item.cnpj }}</td>
              <td>{{ item.tipo }}</td>
              <td>{{ formatDate(item.data_inicio) }}</td>
              <td>{{ formatDate(item.data_termino) }}</td>
              <td>
                <span 
                  class="status-badge" 
                  :class="getStatusClass(item.data_termino)"
                >
                  {{ getStatusText(item.data_termino) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'RelatorioForm',
    data() {
      return {
        tipoRelatorio: 'licitacoes',
        filtros: {
          dataInicio: '',
          dataFim: '',
          vigentes: true
        },
        dadosRelatorio: [],
        loading: false,
        relatorioGerado: false
      };
    },
    methods: {
      resetForm() {
        this.filtros = {
          dataInicio: '',
          dataFim: '',
          vigentes: true
        };
        this.dadosRelatorio = [];
        this.relatorioGerado = false;
      },
      async gerarRelatorio() {
        this.loading = true;
        this.relatorioGerado = true;
        
        try {
          let url = `http://localhost:3000/api/dashboard/relatorio/${this.tipoRelatorio}`;
          let params = {};
          
          if (this.tipoRelatorio !== 'penalidades') {
            if (this.filtros.dataInicio) params.dataInicio = this.filtros.dataInicio;
            if (this.filtros.dataFim) params.dataFim = this.filtros.dataFim;
          } else {
            params.vigentes = this.filtros.vigentes;
          }
          
          const response = await axios.get(url, { params });
          this.dadosRelatorio = response.data;
        } catch (error) {
          console.error(`Erro ao gerar relatório de ${this.tipoRelatorio}:`, error);
          alert(`Erro ao gerar relatório. Verifique o console para mais detalhes.`);
          this.dadosRelatorio = [];
        } finally {
          this.loading = false;
        }
      },
      async exportarExcel() {
        try {
          const response = await axios.get(`http://localhost:3000/api/exportacao/${this.tipoRelatorio}/excel`, {
            params: this.getExportParams(),
            responseType: 'blob'
          });
          
          this.downloadFile(response.data, `relatorio_${this.tipoRelatorio}.xlsx`);
        } catch (error) {
          console.error('Erro ao exportar para Excel:', error);
          alert('Erro ao exportar para Excel. Verifique o console para mais detalhes.');
        }
      },
      async exportarPDF() {
        try {
          const response = await axios.get(`http://localhost:3000/api/exportacao/${this.tipoRelatorio}/pdf`, {
            params: this.getExportParams(),
            responseType: 'blob'
          });
          
          this.downloadFile(response.data, `relatorio_${this.tipoRelatorio}.pdf`);
        } catch (error) {
          console.error('Erro ao exportar para PDF:', error);
          alert('Erro ao exportar para PDF. Verifique o console para mais detalhes.');
        }
      },
      async exportarWord() {
        try {
          const response = await axios.get(`http://localhost:3000/api/exportacao/${this.tipoRelatorio}/word`, {
            params: this.getExportParams(),
            responseType: 'blob'
          });
          
          this.downloadFile(response.data, `relatorio_${this.tipoRelatorio}.docx`);
        } catch (error) {
          console.error('Erro ao exportar para Word:', error);
          alert('Erro ao exportar para Word. Verifique o console para mais detalhes.');
        }
      },
      getExportParams() {
        if (this.tipoRelatorio !== 'penalidades') {
          return {
            dataInicio: this.filtros.dataInicio,
            dataFim: this.filtros.dataFim
          };
        } else {
          return {
            vigentes: this.filtros.vigentes
          };
        }
      },
      downloadFile(data, filename) {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
      },
      formatCurrency(value) {
        if (!value) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      },
      getStatusText(dataTermino) {
        if (!dataTermino) return 'Indefinido';
        
        const hoje = new Date();
        const termino = new Date(dataTermino);
        
        return hoje > termino ? 'Encerrada' : 'Vigente';
      },
      getStatusClass(dataTermino) {
        if (!dataTermino) return 'status-indefinido';
        
        const hoje = new Date();
        const termino = new Date(dataTermino);
        
        return hoje > termino ? 'status-encerrada' : 'status-vigente';
      }
    }
  };
  </script>
  
  <style scoped>
  .relatorio-form {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  h2, h3 {
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  
  .form-control {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .form-row .form-group {
    flex: 1;
  }
  
  .form-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .export-options {
    display: flex;
    gap: 10px;
  }
  
  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }
  
  .btn-primary {
    background-color: #4CAF50;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #45a049;
  }
  
  .btn-success {
    background-color: #2196F3;
    color: white;
  }
  
  .btn-success:hover {
    background-color: #0b7dda;
  }
  
  .btn-danger {
    background-color: #f44336;
    color: white;
  }
  
  .btn-danger:hover {
    background-color: #d32f2f;
  }
  
  .btn-info {
    background-color: #ff9800;
    color: white;
  }
  
  .btn-info:hover {
    background-color: #e68a00;
  }
  
  .btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .loading, .no-results {
    text-align: center;
    padding: 20px;
    color: #666;
    font-style: italic;
  }
  
  .relatorio-results {
    margin-top: 30px;
  }
  
  .relatorio-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  .relatorio-table th, .relatorio-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .relatorio-table th {
    background-color: #f2f2f2;
    font-weight: bold;
    color: #555;
  }
  
  .relatorio-table tr:hover {
    background-color: #f5f5f5;
  }
  
  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
  }
  
  .status-vigente {
    background-color: #e6f7ff;
    color: #1890ff;
    border: 1px solid #91d5ff;
  }
  
  .status-encerrada {
    background-color: #f6ffed;
    color: #52c41a;
    border: 1px solid #b7eb8f;
  }
  
  .status-indefinido {
    background-color: #fff7e6;
    color: #fa8c16;
    border: 1px solid #ffd591;
  }
  </style>