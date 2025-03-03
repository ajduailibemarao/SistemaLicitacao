<!-- src/components/LicitacaoView.vue -->
<template>
  <div class="licitacao-view">
    <div class="page-header">
      <h2>Detalhes da Licitação</h2>
      <div class="page-actions">
        <button @click="editarLicitacao" class="btn btn-primary">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button @click="voltar" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> Voltar
        </button>
      </div>
    </div>
    
    <div v-if="carregando" class="loading">
      Carregando dados da licitação...
    </div>
    
    <div v-else class="card">
      <div class="card-header">
        <h4>{{ licitacao.identificacao }}</h4>
        <span :class="getStatusClass(licitacao.status)">{{ licitacao.status }}</span>
      </div>
      
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h5>Informações Gerais</h5>
            <table class="table table-details">
              <tbody>
                <tr>
                  <th>Modalidade:</th>
                  <td>{{ licitacao.modalidade_nome }}</td>
                </tr>
                <tr>
                  <th>Tipo:</th>
                  <td>{{ licitacao.tipo_nome }}</td>
                </tr>
                <tr>
                  <th>Valor Estimado:</th>
                  <td>{{ formatarValor(licitacao.valor_estimado) }}</td>
                </tr>
                <tr>
                  <th>Valor Adjudicado:</th>
                  <td>{{ formatarValor(licitacao.valor_adjudicado) }}</td>
                </tr>
                <tr>
                  <th>Licitante:</th>
                  <td>{{ licitacao.licitante_nome || 'Não definido' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="col-md-6">
            <h5>Datas</h5>
            <table class="table table-details">
              <tbody>
                <tr>
                  <th>Data de Entrada:</th>
                  <td>{{ formatarData(licitacao.data_entrada) }}</td>
                </tr>
                <tr>
                  <th>Data de Adjudicação:</th>
                  <td>{{ formatarData(licitacao.data_adjudicacao) }}</td>
                </tr>
                <tr>
                  <th>Data de Homologação:</th>
                  <td>{{ formatarData(licitacao.data_homologacao) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="row mt-4">
          <div class="col-md-6">
            <h5>Departamentos</h5>
            <table class="table table-details">
              <tbody>
                <tr>
                  <th>Setor:</th>
                  <td>{{ licitacao.setor_nome }}</td>
                </tr>
                <tr>
                  <th>Diretoria:</th>
                  <td>{{ licitacao.diretoria_nome }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="row mt-4">
          <div class="col-12">
            <h5>Objeto da Licitação</h5>
            <div class="objeto-box">
              {{ licitacao.objeto }}
            </div>
          </div>
        </div>
        
        <div class="row mt-4" v-if="licitacao.observacoes">
          <div class="col-12">
            <h5>Observações</h5>
            <div class="observacoes-box">
              {{ licitacao.observacoes }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LicitacaoView',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      licitacao: {},
      carregando: true
    };
  },
  mounted() {
    this.carregarLicitacao();
  },
  methods: {
    async carregarLicitacao() {
      try {
        this.carregando = true;
        const response = await axios.get(`/api/licitacoes/${this.id}`);
        this.licitacao = response.data;
      } catch (error) {
        console.error('Erro ao carregar licitação:', error);
        alert('Erro ao carregar dados da licitação. Por favor, tente novamente.');
        this.$router.push('/licitacoes');
      } finally {
        this.carregando = false;
      }
    },
    formatarValor(valor) {
      return valor ? `R$ ${parseFloat(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-';
    },
    formatarData(data) {
      if (!data) return '-';
      const dataObj = new Date(data);
      return dataObj.toLocaleDateString('pt-BR');
    },
    getStatusClass(status) {
      switch (status) {
        case 'Em Andamento': return 'status-andamento';
        case 'Concluída': return 'status-concluida';
        case 'Cancelada': return 'status-cancelada';
        default: return '';
      }
    },
    editarLicitacao() {
      this.$router.push(`/licitacoes/${this.id}/editar`);
    },
    voltar() {
      this.$router.push('/licitacoes');
    }
  }
};
</script>

<style scoped>
.licitacao-view {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-style: italic;
  color: #666;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background-color: #f8f9fa;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h4 {
  margin: 0;
  color: #333;
}

.card-body {
  padding: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 0 15px;
}

.col-12 {
  flex: 0 0 100%;
  max-width: 100%;
  padding: 0 15px;
}

.mt-4 {
  margin-top: 1.5rem;
}

.table-details {
  width: 100%;
  border-collapse: collapse;
}

.table-details th, .table-details td {
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.table-details th {
  width: 40%;
  text-align: left;
  font-weight: 600;
  color: #495057;
}

.objeto-box, .observacoes-box {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  white-space: pre-line;
}

.status-andamento {
  background-color: #ffeeba;
  padding: 3px 8px;
  border-radius: 4px;
  color: #856404;
}

.status-concluida {
  background-color: #d4edda;
  padding: 3px 8px;
  border-radius: 4px;
  color: #155724;
}

.status-cancelada {
  background-color: #f8d7da;
  padding: 3px 8px;
  border-radius: 4px;
  color: #721c24;
}

@media (max-width: 768px) {
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .card-header span {
    margin-top: 10px;
  }
}
</style>