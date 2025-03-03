<!-- src/components/LicitacaoForm.vue -->
<template>
  <div class="licitacao-form">
    <h2>{{ isEditing ? 'Editar Licitação' : 'Nova Licitação' }}</h2>
    
    <form @submit.prevent="saveLicitacao">
      <div class="form-row">
        <div class="form-group col">
          <label for="identificacao">Identificação*</label>
          <input 
            type="text" 
            id="identificacao" 
            v-model="licitacao.identificacao" 
            class="form-control" 
            required
          >
        </div>
        
        <div class="form-group col">
          <label for="modalidadeId">Modalidade*</label>
          <select 
            id="modalidadeId" 
            v-model="licitacao.modalidadeId" 
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
          <label for="dataEntrada">Data de Entrada*</label>
          <input 
            type="date" 
            id="dataEntrada" 
            v-model="licitacao.dataEntrada" 
            class="form-control" 
            required
          >
        </div>
        
        <div class="form-group col">
          <label for="tipoId">Tipo*</label>
          <select 
            id="tipoId" 
            v-model="licitacao.tipoId" 
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
        <label for="objeto">Objeto da Licitação*</label>
        <textarea 
          id="objeto" 
          v-model="licitacao.objeto" 
          class="form-control" 
          rows="4" 
          required
        ></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group col">
          <label for="setorId">Setor*</label>
          <select 
            id="setorId" 
            v-model="licitacao.setorId" 
            class="form-control" 
            required
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
          <label for="diretoriaId">Diretoria*</label>
          <select 
            id="diretoriaId" 
            v-model="licitacao.diretoriaId" 
            class="form-control" 
            required
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
            v-model="licitacao.processo" 
            class="form-control"
          >
        </div>
        
        <div class="form-group col">
          <label for="relator">Relator</label>
          <input 
            type="text" 
            id="relator" 
            v-model="licitacao.relator" 
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
            v-model="licitacao.valorEstimado" 
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
            v-model="licitacao.valorAdjudicado" 
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
            v-model="licitacao.dataAdjudicacao" 
            class="form-control"
          >
        </div>
        
        <div class="form-group col">
          <label for="dataHomologacao">Data de Homologação</label>
          <input 
            type="date" 
            id="dataHomologacao" 
            v-model="licitacao.dataHomologacao" 
            class="form-control"
          >
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group col">
          <label for="licitanteId">Licitante Vencedor</label>
          <select 
            id="licitanteId" 
            v-model="licitacao.licitanteId" 
            class="form-control"
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
          <label for="status">Status*</label>
          <select 
            id="status" 
            v-model="licitacao.status" 
            class="form-control" 
            required
          >
            <option value="Em Andamento">Em Andamento</option>
            <option value="Adjudicada">Adjudicada</option>
            <option value="Homologada">Homologada</option>
            <option value="Suspensa">Suspensa</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Fracassada">Fracassada</option>
            <option value="Deserta">Deserta</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="observacoes">Observações</label>
        <textarea 
          id="observacoes" 
          v-model="licitacao.observacoes" 
          class="form-control" 
          rows="3"
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Salvar</button>
        <button type="button" @click="cancel" class="btn btn-secondary">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LicitacaoForm',
  props: {
    licitacaoId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      licitacao: {
        identificacao: '',
        dataEntrada: '',
        modalidadeId: '',
        tipoId: '',
        objeto: '',
        setorId: '',
        diretoriaId: '',
        processo: '',
        relator: '',
        valorEstimado: '',
        valorAdjudicado: '',
        dataAdjudicacao: '',
        dataHomologacao: '',
        licitanteId: '',
        status: 'Em Andamento',
        observacoes: ''
      },
      licitantes: [],
      modalidades: [],
      tipos: [],
      setores: [],
      diretorias: [],
      isEditing: false
    };
  },
  created() {
    this.fetchLicitantes();
    this.fetchModalidades();
    this.fetchTipos();
    this.fetchSetores();
    this.fetchDiretorias();
    
    if (this.licitacaoId) {
      this.isEditing = true;
      this.fetchLicitacao();
    }
  },
  methods: {
    async fetchLicitantes() {
      try {
        const response = await axios.get('/api/licitantes');
        this.licitantes = response.data;
      } catch (error) {
        console.error('Erro ao buscar licitantes:', error);
      }
    },
    async fetchModalidades() {
      try {
        const response = await axios.get('/api/modalidades');
        this.modalidades = response.data;
      } catch (error) {
        console.error('Erro ao buscar modalidades:', error);
      }
    },
    async fetchTipos() {
      try {
        const response = await axios.get('/api/tipos');
        this.tipos = response.data;
      } catch (error) {
        console.error('Erro ao buscar tipos:', error);
      }
    },
    async fetchSetores() {
      try {
        const response = await axios.get('/api/setores');
        this.setores = response.data;
      } catch (error) {
        console.error('Erro ao buscar setores:', error);
      }
    },
    async fetchDiretorias() {
      try {
        const response = await axios.get('/api/diretorias');
        this.diretorias = response.data;
      } catch (error) {
        console.error('Erro ao buscar diretorias:', error);
      }
    },
    async fetchLicitacao() {
      try {
        const response = await axios.get(`/api/licitacoes/${this.licitacaoId}`);
        const licitacao = response.data;
        
        this.licitacao = {
          identificacao: licitacao.identificacao,
          dataEntrada: this.formatDate(licitacao.data_entrada),
          modalidadeId: licitacao.modalidade_id,
          tipoId: licitacao.tipo_id,
          objeto: licitacao.objeto,
          setorId: licitacao.setor_id,
          diretoriaId: licitacao.diretoria_id,
          processo: licitacao.processo,
          relator: licitacao.relator,
          valorEstimado: licitacao.valor_estimado,
          valorAdjudicado: licitacao.valor_adjudicado,
          dataAdjudicacao: licitacao.data_adjudicacao ? this.formatDate(licitacao.data_adjudicacao) : '',
          dataHomologacao: licitacao.data_homologacao ? this.formatDate(licitacao.data_homologacao) : '',
          licitanteId: licitacao.licitante_id,
          status: licitacao.status,
          observacoes: licitacao.observacoes
        };
      } catch (error) {
        console.error('Erro ao buscar licitação:', error);
        alert('Erro ao carregar dados da licitação. Por favor, tente novamente.');
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },
    async saveLicitacao() {
      try {
        const payload = {
          identificacao: this.licitacao.identificacao,
          data_entrada: this.licitacao.dataEntrada,
          modalidade_id: this.licitacao.modalidadeId,
          tipo_id: this.licitacao.tipoId,
          objeto: this.licitacao.objeto,
          setor_id: this.licitacao.setorId,
          diretoria_id: this.licitacao.diretoriaId,
          processo: this.licitacao.processo,
          relator: this.licitacao.relator,
          valor_estimado: this.licitacao.valorEstimado,
          valor_adjudicado: this.licitacao.valorAdjudicado,
          data_adjudicacao: this.licitacao.dataAdjudicacao,
          data_homologacao: this.licitacao.dataHomologacao,
          licitante_id: this.licitacao.licitanteId,
          status: this.licitacao.status,
          observacoes: this.licitacao.observacoes
        };
        
        if (this.isEditing) {
          await axios.put(`/api/licitacoes/${this.licitacaoId}`, payload);
          alert('Licitação atualizada com sucesso!');
        } else {
          await axios.post('/api/licitacoes', payload);
          alert('Licitação cadastrada com sucesso!');
        }
        
        this.$emit('licitacao-saved');
      } catch (error) {
        console.error('Erro ao salvar licitação:', error);
        alert('Erro ao salvar licitação. Verifique os dados e tente novamente.');
      }
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped>
.licitacao-form {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
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
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
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

.btn-secondary {
  background-color: #f44336;
  color: white;
}

.btn-secondary:hover {
  background-color: #d32f2f;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>