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
        <button @click="addNewLicitacao" class="btn btn-primary">
          <i class="fas fa-plus"></i> Nova Licitação
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
              <button @click="viewLicitacao(licitacao.id)" class="btn btn-sm btn-info" title="Visualizar">
                <i class="fas fa-eye"></i>
              </button>
              <button @click="editLicitacao(licitacao.id)" class="btn btn-sm btn-primary" title="Editar">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="confirmDelete(licitacao.id)" class="btn btn-sm btn-danger" title="Excluir">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div class="pagination" v-if="!loading && filteredLicitacoes.length > 0">
      <button 
        @click="currentPage > 1 ? currentPage-- : null" 
        :disabled="currentPage === 1"
        class="btn btn-sm"
      >
        Anterior
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button 
        @click="currentPage < totalPages ? currentPage++ : null" 
        :disabled="currentPage === totalPages"
        class="btn btn-sm"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script>
import LicitacaoService from '@/services/LicitacaoService';

export default {
  name: 'LicitacaoList',
  data() {
    return {
      licitacoes: [],
      loading: true,
      error: null,
      search: '',
      statusFilter: '',
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    filteredLicitacoes() {
      const filtered = this.licitacoes.filter(licitacao => {
        const matchesSearch = licitacao.identificacao.toLowerCase().includes(this.search.toLowerCase());
        const matchesStatus = !this.statusFilter || licitacao.status === this.statusFilter;
        return matchesSearch && matchesStatus;
      });
      
      // Paginação
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },
    totalPages() {
      const filtered = this.licitacoes.filter(licitacao => {
        const matchesSearch = licitacao.identificacao.toLowerCase().includes(this.search.toLowerCase());
        const matchesStatus = !this.statusFilter || licitacao.status === this.statusFilter;
        return matchesSearch && matchesStatus;
      });
      
      return Math.ceil(filtered.length / this.itemsPerPage) || 1;
    }
  },
  created() {
    this.loadLicitacoes();
  },
  watch: {
    search() {
      this.currentPage = 1;
    },
    statusFilter() {
      this.currentPage = 1;
    }
  },
  methods: {
    async loadLicitacoes() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await LicitacaoService.getLicitacoes();
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
      this.$router.push(`/licitacoes/${id}`);
    },
    
    editLicitacao(id) {
      this.$router.push(`/licitacoes/${id}/editar`);
    },
    
    addNewLicitacao() {
      this.$router.push('/licitacoes/nova');
    },
    
    async confirmDelete(id) {
      if (confirm('Tem certeza que deseja excluir esta licitação?')) {
        try {
          await LicitacaoService.deleteLicitacao(id);
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
        await LicitacaoService.exportToExcel(this.search, this.statusFilter);
        alert('Relatório exportado com sucesso!');
      } catch (error) {
        console.error('Erro ao exportar para Excel:', error);
        alert('Erro ao exportar para Excel. Por favor, tente novamente.');
      }
    },
    
    async exportToPDF() {
      try {
        await LicitacaoService.exportToPDF(this.search, this.statusFilter);
        alert('Relatório exportado com sucesso!');
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
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  border-radius: 8px;
  overflow: hidden;
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
  font-weight: 500;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
}

.pagination button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 4px;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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