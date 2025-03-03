// frontend/src/components/penalidades/PenalidadesList.vue
<template>
  <div class="penalidades-list">
    <div class="page-header">
      <h3>Empresas Sancionadas</h3>
      <div class="page-actions">
        <button class="btn btn-primary" @click="novaPenalidade">Nova Sanção</button>
      </div>
    </div>
    
    <div class="filters">
      <div class="search-box">
        <input 
          type="text" 
          v-model="filtro" 
          placeholder="Buscar por empresa, CNPJ ou tipo de sanção..." 
          class="form-control"
        >
      </div>
      
      <div class="filter-options">
        <div class="filter-group">
          <label>Status:</label>
          <select v-model="filtroStatus" class="form-control">
            <option value="todos">Todos</option>
            <option value="vigentes">Vigentes</option>
            <option value="encerradas">Encerradas</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="exportacao-container">
      <h4>Exportar Dados</h4>
      <div class="export-buttons">
        <button class="btn btn-export" @click="exportarExcel">
          <i class="fas fa-file-excel"></i> Excel
        </button>
        <button class="btn btn-export" @click="exportarPDF">
          <i class="fas fa-file-pdf"></i> PDF
        </button>
        <button class="btn btn-export" @click="exportarWord">
          <i class="fas fa-file-word"></i> Word
        </button>
      </div>
    </div>
    
    <div v-if="carregando" class="loading">
      Carregando dados...
    </div>
    
    <div v-else-if="penalidadesFiltradas.length === 0" class="no-data">
      Nenhuma sanção encontrada.
    </div>
    
    <div v-else class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Empresa</th>
            <th>CNPJ</th>
            <th>Tipo de Sanção</th>
            <th>Início</th>
            <th>Término</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="penalidade in penalidadesFiltradas" :key="penalidade.id">
            <td>{{ penalidade.licitante_nome }}</td>
            <td>{{ formatarCNPJ(penalidade.licitante_cnpj) }}</td>
            <td>{{ penalidade.tipo_nome }}</td>
            <td>{{ formatarData(penalidade.data_inicio) }}</td>
            <td>{{ formatarData(penalidade.data_fim) }}</td>
            <td>
              <span :class="getStatusClass(penalidade)">
                {{ getStatusText(penalidade) }}
              </span>
            </td>
            <td class="actions">
              <button class="btn btn-view" @click="verPenalidade(penalidade.id)">Ver</button>
              <button class="btn btn-edit" @click="editarPenalidade(penalidade.id)">Editar</button>
              <button class="btn btn-delete" @click="confirmarExclusao(penalidade)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal de confirmação de exclusão -->
    <div v-if="modalExclusao" class="modal-overlay">
      <div class="modal-content">
        <h4>Confirmar Exclusão</h4>
        <p>Tem certeza que deseja excluir a sanção aplicada à empresa <strong>{{ penalidadeSelecionada.licitante_nome }}</strong>?</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="modalExclusao = false">Cancelar</button>
          <button class="btn btn-danger" @click="excluirPenalidade">Confirmar Exclusão</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PenalidadesList',
  data() {
    return {
      penalidades: [],
      filtro: '',
      filtroStatus: 'todos',
      carregando: true,
      modalExclusao: false,
      penalidadeSelecionada: null
    };
  },
  computed: {
    penalidadesFiltradas() {
      let resultado = this.penalidades;
      
      // Filtrar por texto (empresa, CNPJ ou tipo)
      if (this.filtro) {
        const termoBusca = this.filtro.toLowerCase();
        resultado = resultado.filter(p => 
          (p.licitante_nome && p.licitante_nome.toLowerCase().includes(termoBusca)) ||
          (p.licitante_cnpj && p.licitante_cnpj.includes(termoBusca)) ||
          (p.tipo_nome && p.tipo_nome.toLowerCase().includes(termoBusca))
        );
      }
      
      // Filtrar por status
      const hoje = new Date();
      if (this.filtroStatus === 'vigentes') {
        resultado = resultado.filter(p => new Date(p.data_fim) >= hoje);
      } else if (this.filtroStatus === 'encerradas') {
        resultado = resultado.filter(p => new Date(p.data_fim) < hoje);
      }
      
      return resultado;
    }
  },
  mounted() {
    this.carregarPenalidades();
  },
  methods: {
    async carregarPenalidades() {
      try {
        this.carregando = true;
        const response = await axios.get('/api/penalidades');
        this.penalidades = response.data;
      } catch (error) {
        console.error('Erro ao carregar penalidades:', error);
        alert('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        this.carregando = false;
      }
    },
    
    formatarCNPJ(cnpj) {
      if (!cnpj) return '-';
      return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    },
    
    formatarData(data) {
      if (!data) return '-';
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR');
    },
    
    getStatusClass(penalidade) {
      const hoje = new Date();
      const dataFim = new Date(penalidade.data_fim);
      
      return dataFim >= hoje ? 'status-vigente' : 'status-encerrada';
    },
    
    getStatusText(penalidade) {
      const hoje = new Date();
      const dataFim = new Date(penalidade.data_fim);
      
      return dataFim >= hoje ? 'Vigente' : 'Encerrada';
    },
    
    novaPenalidade() {
      this.$router.push('/penalidades/nova');
    },
    
    verPenalidade(id) {
      this.$router.push(`/penalidades/${id}`);
    },
    
    editarPenalidade(id) {
      this.$router.push(`/penalidades/${id}/editar`);
    },
    
    confirmarExclusao(penalidade) {
      this.penalidadeSelecionada = penalidade;
      this.modalExclusao = true;
    },
    
    async excluirPenalidade() {
      try {
        await axios.delete(`/api/penalidades/${this.penalidadeSelecionada.id}`);
        this.modalExclusao = false;
        this.carregarPenalidades();
        alert('Sanção excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir penalidade:', error);
        alert('Erro ao excluir sanção. Por favor, tente novamente.');
      }
    },
    
    async exportarExcel() {
      try {
        window.open('/api/exportacao/penalidades/excel', '_blank');
      } catch (error) {
        console.error('Erro ao exportar para Excel:', error);
        alert('Erro ao exportar dados. Por favor, tente novamente.');
      }
    },
    
    async exportarPDF() {
      try {
        window.open('/api/exportacao/penalidades/pdf', '_blank');
      } catch (error) {
        console.error('Erro ao exportar para PDF:', error);
        alert('Erro ao exportar dados. Por favor, tente novamente.');
      }
    },
    
    async exportarWord() {
      try {
        window.open('/api/exportacao/penalidades/word', '_blank');
      } catch (error) {
        console.error('Erro ao exportar para Word:', error);
        alert('Erro ao exportar dados. Por favor, tente novamente.');
      }
    }
  }
};
</script>

<style scoped>
.penalidades-list {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.filter-options {
  display: flex;
  gap: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group select {
  width: 150px;
}

.status-vigente {
  background-color: #f8d7da;
  color: #721c24;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-encerrada {
  background-color: #d4edda;
  color: #155724;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.no-data {
  text-align: center;
  padding: 30px;
  color: #666;
  font-style: italic;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>