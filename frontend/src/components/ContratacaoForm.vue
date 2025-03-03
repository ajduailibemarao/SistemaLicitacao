<!-- src/components/ContratacaoForm.vue -->
<template>
  <div class="contratacao-form">
    <h2>{{ isEditing ? 'Editar Contratação Direta' : 'Nova Contratação Direta' }}</h2>
    
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Carregando dados...</p>
    </div>
    
    <form @submit.prevent="saveContratacao" v-else>
      <div class="form-group">
        <label for="identificacaoDispensa">Identificação da Dispensa*</label>
        <input 
          type="text" 
          id="identificacaoDispensa" 
          v-model="contratacao.identificacaoDispensa" 
          class="form-control" 
          required
        >
      </div>
      
      <div class="form-row">
        <div class="form-group col">
          <label for="dataEntrada">Data de Entrada*</label>
          <input 
            type="date" 
            id="dataEntrada" 
            v-model="contratacao.dataEntrada" 
            class="form-control"
            required
          >
        </div>
        
        <div class="form-group col">
          <label for="dataCotacao">Data Cotação Eletrônica</label>
          <input 
            type="date" 
            id="dataCotacao" 
            v-model="contratacao.dataCotacao" 
            class="form-control"
          >
        </div>
        
        <div class="form-group col">
          <label for="horarioCotacao">Horário Cotação Eletrônica</label>
          <input 
            type="time" 
            id="horarioCotacao" 
            v-model="contratacao.horarioCotacao" 
            class="form-control"
          >
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group col">
          <label for="licitanteId">Licitante*</label>
          <select 
            id="licitanteId" 
            v-model="contratacao.licitanteId" 
            class="form-control" 
            required
          >
            <option value="">Selecione um licitante</option>
            <option 
              v-for="licitante in licitantes" 
              :key="licitante.id" 
              :value="licitante.id"
            >
              {{ licitante.razao_social }}
            </option>
          </select>
        </div>
        
        <div class="form-group col">
          <label for="modalidadeId">Modalidade*</label>
          <select 
            id="modalidadeId" 
            v-model="contratacao.modalidadeId" 
            class="form-control" 
            required
          >
            <option value="">Selecione uma modalidade</option>
            <option 
              v-for="modalidade in modalidades" 
              :key="modalidade.id" 
              :value="modalidade.id"
            >
              {{ modalidade.nome }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group col">
          <label for="numeroParecer">Número do Parecer</label>
          <input 
            type="text" 
            id="numeroParecer" 
            v-model="contratacao.numeroParecer" 
            class="form-control"
          >
        </div>
        
        <div class="form-group col">
          <label for="tipoId">Tipo*</label>
          <select 
            id="tipoId" 
            v-model="contratacao.tipoId" 
            class="form-control" 
            required
          >
            <option value="">Selecione um tipo</option>
            <option 
              v-for="tipo in tipos" 
              :key="tipo.id" 
              :value="tipo.id"
            >
              {{ tipo.nome }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="objeto">Objeto*</label>
        <textarea 
          id="objeto" 
          v-model="contratacao.objeto" 
          class="form-control" 
          rows="3" 
          required
        ></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group col">
          <label for="setorId">Setor Solicitante</label>
          <select 
            id="setorId" 
            v-model="contratacao.setorId" 
            class="form-control"
          >
            <option value="">Selecione um setor</option>
            <option 
              v-for="setor in setores" 
              :key="setor.id" 
              :value="setor.id"
            >
              {{ setor.nome }}
            </option>
          </select>
        </div>
        
        <div class="form-group col">
          <label for="diretoriaId">Diretoria</label>
          <select 
            id="diretoriaId" 
            v-model="contratacao.diretoriaId" 
            class="form-control"
          >
            <option value="">Selecione uma diretoria</option>
            <option 
              v-for="diretoria in diretorias" 
              :key="diretoria.id" 
              :value="diretoria.id"
            >
              {{ diretoria.nome }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group col">
          <label for="processo">Processo</label>
          <input 
            type="text" 
            id="processo" 
            v-model="contratacao.processo" 
            class="form-control"
          >
        </div>
        
        <div class="form-group col">
          <label for="relator">Relator</label>
          <input 
            type="text" 
            id="relator" 
            v-model="contratacao.relator" 
            class="form-control"
          >
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group col">
          <label for="valorEstimado">Valor Estimado (R$)</label>
          <input 
            type="number" 
            id="valorEstimado" 
            v-model="contratacao.valorEstimado" 
            class="form-control" 
            step="0.01" 
            min="0"
          >
        </div>
        
        <div class="form-group col">
          <label for="valorAdjudicado">Valor Adjudicado (R$)</label>
          <input 
            type="number" 
            id="valorAdjudicado" 
            v-model="contratacao.valorAdjudicado" 
            class="form-control" 
            step="0.01" 
            min="0"
          >
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group col">
          <label for="dataAdjudicacao">Data de Adjudicação</label>
          <input 
            type="date" 
            id="dataAdjudicacao" 
            v-model="contratacao.dataAdjudicacao" 
            class="form-control"
          >
        </div>
        
        <div class="form-group col">
          <label for="prazoExecucao">Prazo de Execução (dias)</label>
          <input 
            type="number" 
            id="prazoExecucao" 
            v-model="contratacao.prazoExecucao" 
            class="form-control" 
            min="0"
          >
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group col">
          <label for="status">Status*</label>
          <select 
            id="status" 
            v-model="contratacao.status" 
            class="form-control"
            required
          >
            <option value="">Selecione um status</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Aprovada">Aprovada</option>
            <option value="Rejeitada">Rejeitada</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Concluída">Concluída</option>
          </select>
        </div>
        
        <div class="form-group col" v-if="contratacao.status === 'Rejeitada' || contratacao.status === 'Cancelada'">
          <label for="motivo">Motivo (se rejeitada/cancelada)*</label>
          <input 
            type="text" 
            id="motivo" 
            v-model="contratacao.motivo" 
            class="form-control"
            :required="contratacao.status === 'Rejeitada' || contratacao.status === 'Cancelada'"
          >
        </div>
        <div class="form-group col" v-else>
          <label for="motivo">Motivo (opcional)</label>
          <input 
            type="text" 
            id="motivo" 
            v-model="contratacao.motivo" 
            class="form-control"
          >
        </div>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? 'Salvando...' : 'Salvar' }}
        </button>
        <button type="button" @click="confirmCancel" class="btn btn-secondary" :disabled="submitting">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script>
import ContratacaoService from '@/services/ContratacaoService';

export default {
  name: 'ContratacaoForm',
  props: {
    contratacaoId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      contratacao: {
        identificacaoDispensa: '',
        dataEntrada: this.getCurrentDate(),
        dataCotacao: '',
        horarioCotacao: '',
        licitanteId: '',
        modalidadeId: '',
        numeroParecer: '',
        tipoId: '',
        objeto: '',
        setorId: '',
        diretoriaId: '',
        processo: '',
        relator: '',
        valorEstimado: '',
        valorAdjudicado: '',
        dataAdjudicacao: '',
        prazoExecucao: '',
        status: 'Em Análise',
        motivo: ''
      },
      originalContratacao: null,
      licitantes: [],
      modalidades: [],
      tipos: [],
      setores: [],
      diretorias: [],
      isEditing: false,
      loading: false,
      submitting: false,
      formChanged: false
    };
  },
  watch: {
    contratacao: {
      handler(val) {
        if (this.originalContratacao) {
          this.formChanged = JSON.stringify(val) !== JSON.stringify(this.originalContratacao);
        }
      },
      deep: true
    }
  },
  created() {
    this.fetchFormData();
    
    if (this.contratacaoId) {
      this.isEditing = true;
      this.fetchContratacao();
    }
  },
  methods: {
    getCurrentDate() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    async fetchFormData() {
      try {
        this.loading = true;
        const data = await ContratacaoService.getFormData();
        this.modalidades = data.modalidades;
        this.tipos = data.tipos;
        this.setores = data.setores;
        this.diretorias = data.diretorias;
        this.licitantes = data.licitantes;
      } catch (error) {
        console.error('Erro ao buscar dados do formulário:', error);
        this.showError('Erro ao carregar dados necessários para o formulário. Por favor, tente novamente.');
      } finally {
        this.loading = false;
      }
    },
    async fetchContratacao() {
      try {
        this.loading = true;
        const response = await ContratacaoService.getContratacao(this.contratacaoId);
        const contratacao = response.data;
        
        this.contratacao = {
          identificacaoDispensa: contratacao.identificacao_dispensa,
          dataEntrada: contratacao.data_entrada ? this.formatDate(contratacao.data_entrada) : '',
          dataCotacao: contratacao.data_cotacao ? this.formatDate(contratacao.data_cotacao) : '',
          horarioCotacao: contratacao.horario_cotacao || '',
          licitanteId: contratacao.licitante_id,
          modalidadeId: contratacao.modalidade_id,
          numeroParecer: contratacao.numero_parecer,
          tipoId: contratacao.tipo_id,
          objeto: contratacao.objeto,
          setorId: contratacao.setor_id,
          diretoriaId: contratacao.diretoria_id,
          processo: contratacao.processo,
          relator: contratacao.relator,
          valorEstimado: contratacao.valor_estimado,
          valorAdjudicado: contratacao.valor_adjudicado,
          dataAdjudicacao: contratacao.data_adjudicacao ? this.formatDate(contratacao.data_adjudicacao) : '',
          prazoExecucao: contratacao.prazo_execucao,
          status: contratacao.status,
          motivo: contratacao.motivo
        };
        
        // Armazenar o estado original para detectar mudanças
        this.originalContratacao = JSON.parse(JSON.stringify(this.contratacao));
      } catch (error) {
        console.error('Erro ao buscar contratação:', error);
        this.showError('Erro ao carregar dados da contratação. Por favor, tente novamente.');
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },
    validateForm() {
      if (!this.contratacao.identificacaoDispensa.trim()) {
        this.showError('A identificação da dispensa é obrigatória');
        return false;
      }
      
      if (!this.contratacao.dataEntrada) {
        this.showError('A data de entrada é obrigatória');
        return false;
      }
      
      if (!this.contratacao.licitanteId) {
        this.showError('Selecione um licitante');
        return false;
      }
      
      if (!this.contratacao.modalidadeId) {
        this.showError('Selecione uma modalidade');
        return false;
      }
      
      if (!this.contratacao.tipoId) {
        this.showError('Selecione um tipo');
        return false;
      }
      
      if (!this.contratacao.objeto.trim()) {
        this.showError('O objeto da contratação é obrigatório');
        return false;
      }
      
      if (!this.contratacao.status) {
        this.showError('Selecione um status');
        return false;
      }
      
      if ((this.contratacao.status === 'Rejeitada' || this.contratacao.status === 'Cancelada') && !this.contratacao.motivo.trim()) {
        this.showError('O motivo é obrigatório para contratações rejeitadas ou canceladas');
        return false;
      }
      
      return true;
    },
    async saveContratacao() {
      if (!this.validateForm()) return;
      
      try {
        this.submitting = true;
        
        const payload = {
          identificacao_dispensa: this.contratacao.identificacaoDispensa,
          data_entrada: this.contratacao.dataEntrada,
          data_cotacao: this.contratacao.dataCotacao,
          horario_cotacao: this.contratacao.horarioCotacao,
          licitante_id: this.contratacao.licitanteId,
          modalidade_id: this.contratacao.modalidadeId,
          numero_parecer: this.contratacao.numeroParecer,
          tipo_id: this.contratacao.tipoId,
          objeto: this.contratacao.objeto,
          setor_id: this.contratacao.setorId,
          diretoria_id: this.contratacao.diretoriaId,
          processo: this.contratacao.processo,
          relator: this.contratacao.relator,
          valor_estimado: this.contratacao.valorEstimado,
          valor_adjudicado: this.contratacao.valorAdjudicado,
          data_adjudicacao: this.contratacao.dataAdjudicacao,
          prazo_execucao: this.contratacao.prazoExecucao,
          status: this.contratacao.status,
          motivo: this.contratacao.motivo
        };
        
        if (this.isEditing) {
          await ContratacaoService.updateContratacao(this.contratacaoId, payload);
          this.showSuccess('Contratação atualizada com sucesso!');
        } else {
          await ContratacaoService.createContratacao(payload);
          this.showSuccess('Contratação cadastrada com sucesso!');
        }
        
        this.formChanged = false;
        this.$emit('contratacao-saved');
      } catch (error) {
        console.error('Erro ao salvar contratação:', error);
        this.showError('Erro ao salvar contratação. Verifique os dados e tente novamente.');
      } finally {
        this.submitting = false;
      }
    },
    confirmCancel() {
      if (this.formChanged) {
        if (confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
          this.$emit('cancel');
        }
      } else {
        this.$emit('cancel');
      }
    },
    showError(message) {
      alert(message); // Idealmente, use um sistema de notificação mais elegante
    },
    showSuccess(message) {
      alert(message); // Idealmente, use um sistema de notificação mais elegante
    }
  }
};
</script>

<style scoped>
.contratacao-form {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #4CAF50;
  outline: none;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.form-control:invalid {
  border-color: #f44336;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s, transform 0.1s;
}

.btn:active {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #f44336;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d32f2f;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 8px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4CAF50;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-row .form-group {
    margin-bottom: 15px;
  }
}
</style>