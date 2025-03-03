// frontend/src/components/penalidades/PenalidadeForm.vue
<template>
  <div class="penalidade-form">
    <div class="page-header">
      <h3>{{ modoEdicao ? 'Editar Sanção' : 'Nova Sanção' }}</h3>
      <div class="page-actions">
        <button class="btn btn-secondary" @click="voltar">Voltar</button>
      </div>
    </div>
    
    <div v-if="carregando" class="loading">
      Carregando dados...
    </div>
    
    <form v-else @submit.prevent="salvarPenalidade" class="form">
      <div class="form-row">
        <div class="form-group">
          <label for="licitante">Empresa Sancionada*</label>
          <select 
            id="licitante" 
            v-model="penalidade.licitante_id" 
            class="form-control" 
            required
          >
            <option value="">Selecione uma empresa</option>
            <option v-for="licitante in licitantes" :key="licitante.id" :value="licitante.id">
              {{ licitante.razao_social }} ({{ formatarCNPJ(licitante.cnpj) }})
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="tipo_penalidade">Tipo de Sanção*</label>
          <select 
            id="tipo_penalidade" 
            v-model="penalidade.tipo_penalidade" 
            class="form-control" 
            required
          >
            <option value="">Selecione um tipo</option>
            <option v-for="tipo in tiposPenalidade" :key="tipo.id" :value="tipo.id">
              {{ tipo.nome }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="data_inicio">Data de Início*</label>
          <input 
            type="date" 
            id="data_inicio" 
            v-model="penalidade.data_inicio" 
            class="form-control" 
            required
          >
        </div>
        
        <div class="form-group">
          <label for="data_fim">Data de Término*</label>
          <input 
            type="date" 
            id="data_fim" 
            v-model="penalidade.data_fim" 
            class="form-control" 
            required
          >
        </div>
      </div>
      
      <div class="form-group">
        <label for="processo_administrativo">Processo Administrativo</label>
        <input 
          type="text" 
          id="processo_administrativo" 
          v-model="penalidade.processo_administrativo" 
          class="form-control"
          placeholder="Número do processo administrativo"
        >
      </div>
      
      <div class="form-group">
        <label for="motivo">Motivo da Sanção*</label>
        <textarea 
          id="motivo" 
          v-model="penalidade.motivo" 
          class="form-control" 
          rows="4" 
          required
          placeholder="Descreva o motivo da aplicação da sanção"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="observacoes">Observações</label>
        <textarea 
          id="observacoes" 
          v-model="penalidade.observacoes" 
          class="form-control" 
          rows="3"
          placeholder="Observações adicionais (opcional)"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="documento_url">Link do Documento</label>
        <input 
          type="url" 
          id="documento_url" 
          v-model="penalidade.documento_url" 
          class="form-control"
          placeholder="URL do documento oficial (opcional)"
        >
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="voltar">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PenalidadeForm',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      penalidade: {
        licitante_id: '',
        tipo_penalidade: '',
        motivo: '',
        data_inicio: '',
        data_fim: '',
        processo_administrativo: '',
        observacoes: '',
        documento_url: ''
      },
      licitantes: [],
      tiposPenalidade: [],
      carregando: true,
      modoEdicao: false
    };
  },
  mounted() {
    this.carregarDados();
  },
  methods: {
    async carregarDados() {
      try {
        this.carregando = true;
        
        // Carregar licitantes
        const licitantesResponse = await axios.get('/api/licitantes');
        this.licitantes = licitantesResponse.data;
        
        // Carregar tipos de penalidade
        const tiposResponse = await axios.get('/api/penalidades/tipos/listar');
        this.tiposPenalidade = tiposResponse.data;
        
        // Se for edição, carregar dados da penalidade
        if (this.id) {
          this.modoEdicao = true;
          const penalidadeResponse = await axios.get(`/api/penalidades/${this.id}`);
          
          // Formatar datas para o formato esperado pelo input type="date"
          const penalidade = penalidadeResponse.data;
          if (penalidade.data_inicio) {
            penalidade.data_inicio = this.formatarDataParaInput(penalidade.data_inicio);
          }
          if (penalidade.data_fim) {
            penalidade.data_fim = this.formatarDataParaInput(penalidade.data_fim);
          }
          
          this.penalidade = penalidade;
        } else {
          // Para nova penalidade, definir data de início como hoje
          const hoje = new Date();
          this.penalidade.data_inicio = this.formatarDataParaInput(hoje);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        this.carregando = false;
      }
    },
    
    formatarCNPJ(cnpj) {
      if (!cnpj) return '';
      return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    },
    
    formatarDataParaInput(data) {
      if (!data) return '';
      const dataObj = new Date(data);
      return dataObj.toISOString().split('T')[0];
    },
    
    async salvarPenalidade() {
      try {
        if (this.modoEdicao) {
          await axios.put(`/api/penalidades/${this.id}`, this.penalidade);
          alert('Sanção atualizada com sucesso!');
        } else {
          await axios.post('/api/penalidades', this.penalidade);
          alert('Sanção cadastrada com sucesso!');
        }
        this.voltar();
      } catch (error) {
        console.error('Erro ao salvar penalidade:', error);
        alert('Erro ao salvar dados. Por favor, verifique os campos e tente novamente.');
      }
    },
    
    voltar() {
      this.$router.push('/penalidades');
    }
  }
};
</script>

<style scoped>
.penalidade-form {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-style: italic;
  color: #666;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>