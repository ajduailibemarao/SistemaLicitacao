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
      <div class="spinner"></div>
      <p>Carregando dados da licitação...</p>
    </div>
    
    <div v-else-if="erro" class="error-container">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <p>{{ erro }}</p>
      <button @click="carregarLicitacao" class="btn btn-retry">
        <i class="fas fa-sync"></i> Tentar novamente
      </button>
    </div>
    
    <div v-else class="card">
      <div class="card-header">
        <div class="header-info">
          <h4>{{ licitacao.identificacao }}</h4>
          <span :class="getStatusClass(licitacao.status)" class="status-badge">{{ licitacao.status }}</span>
        </div>
        <div class="header-actions">
          <button @click="exportarPDF" class="btn btn-outline" title="Exportar para PDF">
            <i class="fas fa-file-pdf"></i>
          </button>
          <button @click="imprimirLicitacao" class="btn btn-outline" title="Imprimir">
            <i class="fas fa-print"></i>
          </button>
        </div>
      </div>
      
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="info-section">
              <h5><i class="fas fa-info-circle"></i> Informações Gerais</h5>
              <table class="table table-details">
                <tbody>
                  <tr>
                    <th>Modalidade:</th>
                    <td>{{ licitacao.modalidade_nome || '-' }}</td>
                  </tr>
                  <tr>
                    <th>Tipo:</th>
                    <td>{{ licitacao.tipo_nome || '-' }}</td>
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
                  <tr v-if="licitacao.processo">
                    <th>Processo:</th>
                    <td>{{ licitacao.processo }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="info-section">
              <h5><i class="fas fa-calendar-alt"></i> Datas</h5>
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
        </div>
        
        <div class="row mt-4">
          <div class="col-md-6">
            <div class="info-section">
              <h5><i class="fas fa-building"></i> Departamentos</h5>
              <table class="table table-details">
                <tbody>
                  <tr>
                    <th>Setor:</th>
                    <td>{{ licitacao.setor_nome || '-' }}</td>
                  </tr>
                  <tr>
                    <th>Diretoria:</th>
                    <td>{{ licitacao.diretoria_nome || '-' }}</td>
                  </tr>
                  <tr v-if="licitacao.relator">
                    <th>Relator:</th>
                    <td>{{ licitacao.relator }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="col-md-6" v-if="licitacao.licitante_nome">
            <div class="info-section">
              <h5><i class="fas fa-handshake"></i> Informações do Licitante</h5>
              <table class="table table-details">
                <tbody>
                  <tr>
                    <th>Razão Social:</th>
                    <td>{{ licitacao.licitante_nome }}</td>
                  </tr>
                  <tr v-if="licitacao.licitante_cnpj">
                    <th>CNPJ:</th>
                    <td>{{ formatarCNPJ(licitacao.licitante_cnpj) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="row mt-4">
          <div class="col-12">
            <div class="info-section">
              <h5><i class="fas fa-file-alt"></i> Objeto da Licitação</h5>
              <div class="objeto-box">
                {{ licitacao.objeto || 'Não informado' }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="row mt-4" v-if="licitacao.observacoes">
          <div class="col-12">
            <div class="info-section">
              <h5><i class="fas fa-comment-alt"></i> Observações</h5>
              <div class="observacoes-box">
                {{ licitacao.observacoes }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="row mt-4" v-if="licitacao.anexos && licitacao.anexos.length > 0">
          <div class="col-12">
            <div class="info-section">
              <h5><i class="fas fa-paperclip"></i> Anexos</h5>
              <ul class="anexos-list">
                <li v-for="(anexo, index) in licitacao.anexos" :key="index">
                  <a :href="anexo.url" target="_blank">
                    <i class="fas fa-file"></i> {{ anexo.nome }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LicitacaoService from '@/services/LicitacaoService';

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
      carregando: true,
      erro: null
    };
  },
  mounted() {
    this.carregarLicitacao();
  },
  methods: {
    async carregarLicitacao() {
      try {
        this.carregando = true;
        this.erro = null;
        const response = await LicitacaoService.getLicitacao(this.id);
        this.licitacao = response.data;
      } catch (error) {
        console.error('Erro ao carregar licitação:', error);
        this.erro = 'Erro ao carregar dados da licitação. Por favor, tente novamente.';
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
    formatarCNPJ(cnpj) {
      if (!cnpj) return '-';
      return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
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
    editarLicitacao() {
      this.$router.push(`/licitacoes/${this.id}/editar`);
    },
    voltar() {
      this.$router.push('/licitacoes');
    },
    async exportarPDF() {
      try {
        await LicitacaoService.exportarPDF(this.id);
        alert('PDF gerado com sucesso!');
      } catch (error) {
        console.error('Erro ao exportar para PDF:', error);
        alert('Erro ao gerar PDF. Por favor, tente novamente.');
      }
    },
    imprimirLicitacao() {
      window.print();
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
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
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

.error-container {
  text-align: center;
  padding: 30px;
  background-color: #fff3f3;
  border-radius: 8px;
  border: 1px solid #ffcdd2;
  color: #d32f2f;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.btn-retry {
  margin-top: 15px;
  background-color: #f44336;
  color: white;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.header-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.card-header h4 {
  margin: 0;
  color: #333;
  font-weight: 600;
}

.card-body {
  padding: 20px;
}

.info-section {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 15px;
  height: 100%;
}

.info-section h5 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 8px;
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
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  white-space: pre-line;
  min-height: 80px;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
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

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #607d8b;
  color: white;
}

.btn-secondary:hover {
  background-color: #546e7a;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #ddd;
  color: #555;
  padding: 6px 10px;
}

.btn-outline:hover {
  background-color: #f5f5f5;
}

.anexos-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.anexos-list li {
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.anexos-list a {
  color: #2196F3;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.anexos-list a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .header-actions {
    align-self: flex-end;
  }
}

@media print {
  .page-actions, .header-actions {
    display: none;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid #ddd;
  }
  
  .licitacao-view {
    padding: 0;
  }
}
</style>