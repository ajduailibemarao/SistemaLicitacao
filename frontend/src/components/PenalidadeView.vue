// frontend/src/components/penalidades/PenalidadeView.vue
<template>
  <div class="penalidade-view">
    <div class="page-header">
      <h3>Detalhes da Sanção</h3>
      <div class="page-actions">
        <button class="btn btn-primary" @click="editarPenalidade">Editar</button>
        <button class="btn btn-secondary" @click="voltar">Voltar</button>
      </div>
    </div>
    
    <div v-if="carregando" class="loading">
      Carregando dados...
    </div>
    
    <div v-else class="penalidade-details">
      <div class="card">
        <div class="card-header">
          <h4>{{ penalidade.licitante_nome }}</h4>
          <span class="cnpj">CNPJ: {{ formatarCNPJ(penalidade.licitante_cnpj) }}</span>
        </div>
        
        <div class="card-body">
          <div class="info-section">
            <h5>Informações da Sanção</h5>
            
            <div class="info-row">
              <div class="info-group">
                <label>Tipo de Sanção:</label>
                <span>{{ penalidade.tipo_nome }}</span>
              </div>
              
              <div class="info-group">
                <label>Status:</label>
                <span :class="getStatusClass(penalidade)">
                  {{ getStatusText(penalidade) }}
                </span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-group">
                <label>Data de Início:</label>
                <span>{{ formatarData(penalidade.data_inicio) }}</span>
              </div>
              
              <div class="info-group">
                <label>Data de Término:</label>
                <span>{{ formatarData(penalidade.data_fim) }}</span>
              </div>
            </div>
            
            <div class="info-group full-width">
              <label>Processo Administrativo:</label>
              <span>{{ penalidade.processo_administrativo || 'Não informado' }}</span>
            </div>
          </div>
          
          <div class="info-section">
            <h5>Motivo da Sanção</h5>
            <p class="motivo">{{ penalidade.motivo }}</p>
          </div>
          
          <div class="info-section" v-if="penalidade.observacoes">
            <h5>Observações</h5>
            <p class="observacoes">{{ penalidade.observacoes }}</p>
          </div>
          
          <div class="info-section" v-if="penalidade.documento_url">
            <h5>Documento</h5>
            <a :href="penalidade.documento_url" target="_blank" class="documento-link">
              Visualizar documento oficial
            </a>
          </div>
          
          <div class="info-section">
            <h5>Informações do Registro</h5>
            
            <div class="info-row">
              <div class="info-group">
                <label>Criado em:</label>
                <span>{{ formatarDataHora(penalidade.criado_em) }}</span>
              </div>
              
              <div class="info-group">
                <label>Última atualização:</label>
                <span>{{ formatarDataHora(penalidade.atualizado_em) }}</span>
              </div>
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
  name: 'PenalidadeView',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      penalidade: {},
      carregando: true
    };
  },
  mounted() {
    this.carregarPenalidade();
  },
  methods: {
    async carregarPenalidade() {
      try {
        this.carregando = true;
        const response = await axios.get(`/api/penalidades/${this.id}`);
        this.penalidade = response.data;
      } catch (error) {
        console.error('Erro ao carregar penalidade:', error);
        alert('Erro ao carregar dados da sanção. Por favor, tente novamente.');
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
    
    formatarDataHora(dataHora) {
      if (!dataHora) return '-';
      const dataObj = new Date(dataHora);
      return `${dataObj.toLocaleDateString('pt-BR')} ${dataObj.toLocaleTimeString('pt-BR')}`;
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
    
    editarPenalidade() {
      this.$router.push(`/penalidades/${this.id}/editar`);
    },
    
    voltar() {
      this.$router.push('/penalidades');
    }
  }
};
</script>

<style scoped>
.penalidade-view {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  border-bottom: 1px solid #eee;
}

.card-header h4 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.cnpj {
  display: block;
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.card-body {
  padding: 20px;
}

.info-section {
  margin-bottom: 25px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h5 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #444;
  font-size: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
}

.info-group {
  flex: 1;
  min-width: 200px;
}

.info-group.full-width {
  flex-basis: 100%;
}

.info-group label {
  display: block;
  font-weight: 500;
  color: #666;
  margin-bottom: 5px;
  font-size: 14px;
}

.motivo, .observacoes {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin: 0;
  line-height: 1.5;
}

.documento-link {
  display: inline-block;
  color: #2196F3;
  text-decoration: none;
  padding: 8px 15px;
  background-color: #e3f2fd;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.documento-link:hover {
  background-color: #bbdefb;
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

@media (max-width: 768px) {
  .info-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .info-group {
    min-width: 100%;
  }
}
</style>