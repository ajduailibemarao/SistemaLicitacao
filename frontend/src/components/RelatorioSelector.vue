// frontend/src/components/relatorios/RelatorioSelector.vue
<template>
  <div class="relatorio-selector">
    <div class="page-header">
      <h3>Relatórios</h3>
    </div>
    
    <div class="relatorio-options">
      <div class="relatorio-card" @click="selecionarRelatorio('geral')">
        <div class="relatorio-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="relatorio-title">Relatório Geral</div>
        <div class="relatorio-description">
          Visão geral das licitações por período, com totais e valores
        </div>
      </div>
      
      <div class="relatorio-card" @click="selecionarRelatorio('demandas')">
        <div class="relatorio-icon">
          <i class="fas fa-building"></i>
        </div>
        <div class="relatorio-title">Relatório de Demandas</div>
        <div class="relatorio-description">
          Análise de licitações por diretoria solicitante
        </div>
      </div>
      
      <div class="relatorio-card" @click="selecionarRelatorio('detalhamento')">
        <div class="relatorio-icon">
          <i class="fas fa-list-alt"></i>
        </div>
        <div class="relatorio-title">Relatório de Detalhamento</div>
        <div class="relatorio-description">
          Detalhamento por tipo ou modalidade de licitação
        </div>
      </div>
      
      <div class="relatorio-card" @click="selecionarRelatorio('status')">
        <div class="relatorio-icon">
          <i class="fas fa-tasks"></i>
        </div>
        <div class="relatorio-title">Status das Licitações</div>
        <div class="relatorio-description">
          Distribuição de licitações por status atual
        </div>
      </div>
    </div>
    
    <component :is="componenteAtual" v-if="tipoRelatorio"></component>
  </div>
</template>

<script>
import RelatorioGeral from './RelatorioGeral.vue';
import RelatorioDemandas from './RelatorioDemandas.vue';
import RelatorioDetalhamento from './RelatorioDetalhamento.vue';
import RelatorioStatus from './RelatorioStatus.vue';

export default {
  name: 'RelatorioSelector',
  components: {
    RelatorioGeral,
    RelatorioDemandas,
    RelatorioDetalhamento,
    RelatorioStatus
  },
  data() {
    return {
      tipoRelatorio: null
    };
  },
  computed: {
    componenteAtual() {
      switch (this.tipoRelatorio) {
        case 'geral':
          return 'RelatorioGeral';
        case 'demandas':
          return 'RelatorioDemandas';
        case 'detalhamento':
          return 'RelatorioDetalhamento';
        case 'status':
          return 'RelatorioStatus';
        default:
          return null;
      }
    }
  },
  methods: {
    selecionarRelatorio(tipo) {
      this.tipoRelatorio = tipo;
    }
  }
};
</script>

<style scoped>
.relatorio-selector {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.relatorio-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.relatorio-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.relatorio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.relatorio-icon {
  font-size: 36px;
  color: #3498db;
  margin-bottom: 15px;
}

.relatorio-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.relatorio-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .relatorio-options {
    grid-template-columns: 1fr;
  }
}
</style>