<!-- src/components/LicitacaoList.vue -->
<template>
  <div class="licitacao-list">
    <h2>Lista de Licitações</h2>
    
    <div class="filters">
      <div class="filter-group">
        <input 
          v-model="search" 
          placeholder="Buscar por identificação..." 
          class="form-control"
        >
        <select v-model="statusFilter" class="form-control">
          <option value="">Todos os status</option>
          <option value="Em Andamento">Em andamento</option>
          <option value="Adjudicada">Adjudicada</option>
          <option value="Homologada">Homologada</option>
          <option value="Suspensa">Suspensa</option>
          <option value="Cancelada">Cancelada</option>
          <option value="Fracassada">Fracassada</option>
          <option value="Deserta">Deserta</option>
        </select>
      </div>
      
      <div class="filter-actions">
        <button @click="exportToExcel" class="btn btn-outline">
          <i class="fas fa-file-excel"></i> Exportar Excel
        </button>
        <button @click="exportToPDF" class="btn btn-outline">
          <i class="fas fa-file-pdf"></i> Exportar PDF
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      Carregando licitações...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="filteredLicitacoes.length === 0" class="no-data">
      Nenhuma licitação encontrada.
    </div>
    
    <table v-else class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Identificação</th>
          <th>Modalidade</th>
          <th>Data de Entrada</th>
          <th>Valor Estimado</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="licitacao in filteredLicitacoes" :key="licitacao.id">
          <td>{{ licitacao.id }}</td>
          <td>{{ licitacao.identificacao }}</td>
          <td>{{ licitacao.modalidade_nome }}</td>
          <td>{{ formatDate(licitacao.data_entrada) }}</td>
          <td>{{ formatCurrency(licitacao.valor_estimado) }}</td>
          <td>
            <span :class="getStatusClass(licitacao.status)" class="status-badge">
              {{ licitacao.status }}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button @click="viewLicitacao(licitacao.id)" class="btn btn-sm btn-info">
                <i class="fas fa-eye"></i>
              </button>
              <button @click="editLicitacao(licitacao.id)" class="btn btn-sm btn-primary">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="confirmDelete(licitacao.id)" class="btn btn-sm btn-danger">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LicitacaoList',
  data() {
    return {
      licitacoes: [],
      loading: true,
      error: null,
      search: '',
      statusFilter: ''
    };
  },
  computed: {
    filteredLicitacoes() {
      return this.licitacoes.filter(licitacao => {
        const matchesSearch = licitacao.identificacao.toLowerCase().includes(this.search.toLowerCase());
        const matchesStatus = !this.statusFilter || licitacao.status === this.statusFilter;
        return matchesSearch && matchesStatus;
      });
    }
  },
  created() {
    this.loadLicitacoes();
  },
  methods: {
    async loadLicitacoes() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/api/licitacoes');
        this.licitacoes = response.data;
      } catch (error) {
        console.error('Erro ao carregar licitações:', error);
        this.error = 'Erro ao carregar licitações. Por favor, tente novamente.';
      } finally {
        this.loading = false;
      }
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
    
    getStatusClass(status) {
      switch (status) {
        case 'Em Andamento': return 'status-andamento';
        case 'Adjudicada': return 'status-adjudicada';
        case 'Homologada': return 'status-homologada';
        case 'Suspensa': return 'status-suspensa';
        case 'Cancelada': return 'status-cancelada';
        case 'Fracassada': return 'status-fracassada';
        case 'Deserta': return 'status-deserta';
        default: return 'status-default';
      }
    },
    
    viewLicitacao(id) {
      this.$emit('view-licitacao', id);
    },
    
    editLicitacao(id) {
      this.$emit('edit-licitacao', id);
    },
    
    async confirmDelete(id) {
      if (confirm('Tem certeza que deseja excluir esta licitação?')) {
        try {
          await axios.delete(`/api/licitacoes/${id}`);
          alert('Licitação excluída com sucesso!');
          this.loadLicitacoes();
        } catch (error) {
          console.error('Erro ao excluir licitação:', error);
          alert('Erro ao excluir licitação. Por favor, tente novamente.');
        }
      }
    },
    
    async exportToExcel() {
      try {
        const response = await axios.get('/api/exportacao/licitacoes/excel', {
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'licitacoes.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Erro ao exportar para Excel:', error);
        alert('Erro ao exportar para Excel. Por favor, tente novamente.');
      }
    },
    
    async exportToPDF() {
      try {
        const response = await axios.get('/api/exportacao/licitacoes/pdf', {
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'licitacoes.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Erro ao exportar para PDF:', error);
        alert('Erro ao exportar para PDF. Por favor, tente novamente.');
      }
    }
  }
};
</script>

<style scoped>
.licitacao-list {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  gap: 10px;
  flex: 1;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.form-control {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table th, .table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.table th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #333;
}

.table tr:hover {
  background-color: #f9f9f9;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
}

.btn-info {
  background-color: #2196F3;
  color: white;
}

.btn-info:hover {
  background-color: #0b7dda;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #ddd;
  color: #333;
}

.btn-outline:hover {
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

.status-adjudicada, .status-homologada {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-suspensa {
  background-color: #fff8e1;
  color: #ffa000;
}

.status-cancelada, .status-fracassada, .status-deserta {
  background-color: #ffebee;
  color: #d32f2f;
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

.error {
  text-align: center;
  padding: 20px;
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 4px;
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
    gap: 10px;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .table {
    display: block;
    overflow-x: auto;
  }
}
</style>