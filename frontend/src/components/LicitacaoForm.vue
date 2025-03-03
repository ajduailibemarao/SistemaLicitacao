<!-- frontend/src/components/LicitacaoForm.vue -->
<template>
    <div class="licitacao-form">
      <h2>{{ isEditing ? 'Editar Licitação' : 'Nova Licitação' }}</h2>
      
      <form @submit.prevent="saveLicitacao">
        <div class="form-group">
          <label for="identificacao">Identificação*</label>
          <input 
            type="text" 
            id="identificacao" 
            v-model="licitacao.identificacao" 
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
              v-model="licitacao.dataEntrada" 
              class="form-control"
            >
          </div>
          
          <div class="form-group col">
            <label for="dataLicitacao">Data da Licitação</label>
            <input 
              type="date" 
              id="dataLicitacao" 
              v-model="licitacao.dataLicitacao" 
              class="form-control"
            >
          </div>
          
          <div class="form-group col">
            <label for="horarioLicitacao">Horário</label>
            <input 
              type="time" 
              id="horarioLicitacao" 
              v-model="licitacao.horarioLicitacao" 
              class="form-control"
            >
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group col">
            <label for="modalidadeId">Modalidade*</label>
            <select 
              id="modalidadeId" 
              v-model="licitacao.modalidadeId" 
              class="form-control" 
              required
            >
              <option value="">Selecione...</option>
              <option v-for="modalidade in modalidades" :key="modalidade.id" :value="modalidade.id">
                {{ modalidade.nome }}
              </option>
            </select>
          </div>
          
          <div class="form-group col">
            <label for="tipoId">Tipo*</label>
            <select 
              id="tipoId" 
              v-model="licitacao.tipoId" 
              class="form-control" 
              required
            >
              <option value="">Selecione...</option>
              <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id">
                {{ tipo.nome }}
              </option>
            </select>
          </div>
          
          <div class="form-group col">
            <label for="numeroLicitacao">Número da Licitação</label>
            <input 
              type="text" 
              id="numeroLicitacao" 
              v-model="licitacao.numeroLicitacao" 
              class="form-control"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="objeto">Objeto</label>
          <textarea 
            id="objeto" 
            v-model="licitacao.objeto" 
            class="form-control" 
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group col">
            <label for="setorId">Setor Solicitante*</label>
            <select 
              id="setorId" 
              v-model="licitacao.setorId" 
              class="form-control" 
              required
            >
              <option value="">Selecione...</option>
              <option v-for="setor in setores" :key="setor.id" :value="setor.id">
                {{ setor.nome }}
              </option>
            </select>
          </div>
          
          <div class="form-group col">
            <label for="diretoriaId">Diretoria</label>
            <select 
              id="diretoriaId" 
              v-model="licitacao.diretoriaId" 
              class="form-control"
            >
              <option value="">Selecione...</option>
              <option v-for="diretoria in diretorias" :key="diretoria.id" :value="diretoria.id">
                {{ diretoria.nome }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group col">
            <label for="licitanteId">Licitante</label>
            <select 
              id="licitanteId" 
              v-model="licitacao.licitanteId" 
              class="form-control"
            >
              <option value="">Selecione...</option>
              <option v-for="licitante in licitantes" :key="licitante.id" :value="licitante.id">
                {{ licitante.razao_social }}
              </option>
            </select>
          </div>
          
          <div class="form-group col">
            <label for="porteLicitante">Porte do Licitante</label>
            <select 
              id="porteLicitante" 
              v-model="licitacao.porteLicitante" 
              class="form-control"
            >
              <option value="">Selecione...</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group col">
            <label for="clienteInterno">Cliente Interno</label>
            <input 
              type="text" 
              id="clienteInterno" 
              v-model="licitacao.clienteInterno" 
              class="form-control"
            >
          </div>
          
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
            <label for="valorAdjudicacao">Valor Adjudicado (R$)</label>
            <input 
              type="number" 
              id="valorAdjudicacao" 
              v-model="licitacao.valorAdjudicacao" 
              class="form-control" 
              step="0.01" 
              min="0"
            >
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group col">
            <label for="prazoExecucao">Prazo de Execução</label>
            <input 
              type="text" 
              id="prazoExecucao" 
              v-model="licitacao.prazoExecucao" 
              class="form-control"
            >
          </div>
          
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
            <label for="status">Status</label>
            <select 
              id="status" 
              v-model="licitacao.status" 
              class="form-control"
            >
              <option value="">Selecione...</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Adjudicada">Adjudicada</option>
              <option value="Suspensa">Suspensa</option>
              <option value="Revogada">Revogada</option>
              <option value="Anulada">Anulada</option>
              <option value="Fracassada">Fracassada</option>
              <option value="Deserta">Deserta</option>
              <option value="Em análise">Em análise</option>
              <option value="Devolvido">Devolvido</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="motivo">Motivo/Observações</label>
          <textarea 
            id="motivo" 
            v-model="licitacao.motivo" 
            class="form-control" 
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Salvar</button>
          <button type="button" @click="cancelar" class="btn btn-secondary">Cancelar</button>
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
        type: [Number, String],
        default: null
      }
    },
    data() {
      return {
        licitacao: {
          identificacao: '',
          dataEntrada: '',
          dataLicitacao: '',
          horarioLicitacao: '',
          licitanteId: '',
          porteLicitante: '',
          modalidadeId: '',
          numeroLicitacao: '',
          tipoId: '',
          objeto: '',
          setorId: '',
          diretoriaId: '',
          clienteInterno: '',
          processo: '',
          relator: '',
          valorEstimado: '',
          valorAdjudicacao: '',
          prazoExecucao: '',
          dataAdjudicacao: '',
          status: '',
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
      this.loadDependencies();
      
      if (this.licitacaoId) {
        this.isEditing = true;
        this.loadLicitacao();
      }
    },
    methods: {
      async loadDependencies() {
        try {
          // Carregar licitantes
          const licitantesResponse = await axios.get('http://localhost:5000/api/licitantes');
          this.licitantes = licitantesResponse.data;
          
          // Carregar modalidades
          const modalidadesResponse = await axios.get('http://localhost:5000/api/modalidades');
          this.modalidades = modalidadesResponse.data;
          
          // Carregar tipos
          const tiposResponse = await axios.get('http://localhost:5000/api/tipos');
          this.tipos = tiposResponse.data;
          
          // Carregar setores
          const setoresResponse = await axios.get('http://localhost:5000/api/setores');
          this.setores = setoresResponse.data;
          
          // Carregar diretorias
          const diretoriasResponse = await axios.get('http://localhost:5000/api/diretorias');
          this.diretorias = diretoriasResponse.data;
        } catch (error) {
          console.error('Erro ao carregar dependências:', error);
          alert('Erro ao carregar dados necessários para o formulário');
        }
      },
      
      async loadLicitacao() {
        try {
          const response = await axios.get(`http://localhost:5000/api/licitacoes/${this.licitacaoId}`);
          const licitacao = response.data;
          
          // Mapear os dados do backend para o formato do formulário
          this.licitacao = {
            identificacao: licitacao.identificacao,
            dataEntrada: licitacao.data_entrada ? new Date(licitacao.data_entrada).toISOString().split('T')[0] : '',
            dataLicitacao: licitacao.data_licitacao ? new Date(licitacao.data_licitacao).toISOString().split('T')[0] : '',
            horarioLicitacao: licitacao.horario_licitacao ? licitacao.horario_licitacao.substring(0, 5) : '',
            licitanteId: licitacao.licitante_id || '',
            porteLicitante: licitacao.porte_licitante || '',
            modalidadeId: licitacao.modalidade_id || '',
            numeroLicitacao: licitacao.numero_licitacao || '',
            tipoId: licitacao.tipo_id || '',
            objeto: licitacao.objeto || '',
            setorId: licitacao.setor_id || '',
            diretoriaId: licitacao.diretoria_id || '',
            clienteInterno: licitacao.cliente_interno || '',
            processo: licitacao.processo || '',
            relator: licitacao.relator || '',
            valorEstimado: licitacao.valor_estimado || '',
            valorAdjudicacao: licitacao.valor_adjudicacao || '',
            prazoExecucao: licitacao.prazo_execucao || '',
            dataAdjudicacao: licitacao.data_adjudicacao ? new Date(licitacao.data_adjudicacao).toISOString().split('T')[0] : '',
            status: licitacao.status || '',
            motivo: licitacao.motivo || ''
          };
        } catch (error) {
          console.error('Erro ao carregar licitação:', error);
          alert('Erro ao carregar dados da licitação');
        }
      },
      
      async saveLicitacao() {
        try {
          if (this.isEditing) {
            await axios.put(`http://localhost:5000/api/licitacoes/${this.licitacaoId}`, this.licitacao);
            alert('Licitação atualizada com sucesso!');
          } else {
            await axios.post('http://localhost:5000/api/licitacoes', this.licitacao);
            alert('Licitação cadastrada com sucesso!');
          }
          
          this.$emit('licitacao-saved');
          this.cancelar();
        } catch (error) {
          console.error('Erro ao salvar licitação:', error);
          alert('Erro ao salvar licitação. Verifique os dados e tente novamente.');
        }
      },
      
      cancelar() {
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
    margin-bottom: 20px;
    color: #333;
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
    padding: 8px;
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
    margin-bottom: 0;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .btn-primary {
    background-color: #4CAF50;
    color: white;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  </style>