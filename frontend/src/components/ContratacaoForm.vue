<!-- src/components/ContratacaoForm.vue -->
<template>
    <div class="contratacao-form">
      <h2>{{ isEditing ? 'Editar Contratação Direta' : 'Nova Contratação Direta' }}</h2>
      
      <form @submit.prevent="saveContratacao">
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
            <label for="dataEntrada">Data de Entrada</label>
            <input 
              type="date" 
              id="dataEntrada" 
              v-model="contratacao.dataEntrada" 
              class="form-control"
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
            <label for="status">Status</label>
            <select 
              id="status" 
              v-model="contratacao.status" 
              class="form-control"
            >
              <option value="">Selecione um status</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Aprovada">Aprovada</option>
              <option value="Rejeitada">Rejeitada</option>
              <option value="Cancelada">Cancelada</option>
              <option value="Concluída">Concluída</option>
            </select>
          </div>
          
          <div class="form-group col">
            <label for="motivo">Motivo (se rejeitada/cancelada)</label>
            <input 
              type="text" 
              id="motivo" 
              v-model="contratacao.motivo" 
              class="form-control"
            >
          </div>
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
    name: 'ContratacaoForm',
    props: {
      contratacaoId: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        contratacao: {
          identificacaoDispensa: '',
          dataEntrada: '',
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
      
      if (this.contratacaoId) {
        this.isEditing = true;
        this.fetchContratacao();
      }
    },
    methods: {
      async fetchLicitantes() {
        try {
          const response = await axios.get('http://localhost:3000/api/licitantes');
          this.licitantes = response.data;
        } catch (error) {
          console.error('Erro ao buscar licitantes:', error);
        }
      },
      async fetchModalidades() {
        try {
          const response = await axios.get('http://localhost:3000/api/modalidades');
          this.modalidades = response.data;
        } catch (error) {
          console.error('Erro ao buscar modalidades:', error);
        }
      },
      async fetchTipos() {
        try {
          const response = await axios.get('http://localhost:3000/api/tipos');
          this.tipos = response.data;
        } catch (error) {
          console.error('Erro ao buscar tipos:', error);
        }
      },
      async fetchSetores() {
        try {
          const response = await axios.get('http://localhost:3000/api/setores');
          this.setores = response.data;
        } catch (error) {
          console.error('Erro ao buscar setores:', error);
        }
      },
      async fetchDiretorias() {
        try {
          const response = await axios.get('http://localhost:3000/api/diretorias');
          this.diretorias = response.data;
        } catch (error) {
          console.error('Erro ao buscar diretorias:', error);
        }
      },
      async fetchContratacao() {
        try {
          const response = await axios.get(`http://localhost:3000/api/contratacoes/${this.contratacaoId}`);
          const contratacao = response.data;
          
          // Formatar datas para o formato esperado pelo input type="date"
          this.contratacao = {
            ...contratacao,
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
        } catch (error) {
          console.error('Erro ao buscar contratação:', error);
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      },
      async saveContratacao() {
        try {
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
            await axios.put(`http://localhost:3000/api/contratacoes/${this.contratacaoId}`, payload);
            alert('Contratação atualizada com sucesso!');
          } else {
            await axios.post('http://localhost:3000/api/contratacoes', payload);
            alert('Contratação cadastrada com sucesso!');
          }
          
          this.$emit('contratacao-saved');
        } catch (error) {
          console.error('Erro ao salvar contratação:', error);
          alert('Erro ao salvar contratação. Verifique os dados e tente novamente.');
        }
      },
      cancel() {
        this.$emit('cancel');
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
  </style>