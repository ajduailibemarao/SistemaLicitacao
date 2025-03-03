<!-- src/components/ImportacaoComponent.vue -->
<template>
    <div class="importacao-container">
      <h3>Importar Dados</h3>
      
      <div class="import-form">
        <div class="form-group">
          <label>Tipo de Arquivo:</label>
          <select v-model="tipoArquivo" class="form-control">
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Selecione o Arquivo:</label>
          <input type="file" @change="selecionarArquivo" :accept="tipoArquivo === 'json' ? '.json' : '.csv'" class="form-control-file">
        </div>
        
        <button @click="importarArquivo" class="btn btn-success" :disabled="!arquivoSelecionado">
          <i class="fas fa-upload"></i> Importar Dados
        </button>
      </div>
      
      <div v-if="mensagem" class="alert" :class="sucesso ? 'alert-success' : 'alert-danger'">
        {{ mensagem }}
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ImportacaoComponent',
    data() {
      return {
        tipoArquivo: 'json',
        arquivoSelecionado: null,
        mensagem: '',
        sucesso: false
      }
    },
    methods: {
      selecionarArquivo(event) {
        this.arquivoSelecionado = event.target.files[0];
        this.mensagem = '';
      },
      
      async importarArquivo() {
        if (!this.arquivoSelecionado) {
          this.mensagem = 'Selecione um arquivo para importar';
          this.sucesso = false;
          return;
        }
        
        try {
          const formData = new FormData();
          formData.append('arquivo', this.arquivoSelecionado);
          
          const response = await axios.post(
            `http://localhost:3000/api/exportacao/licitantes/${this.tipoArquivo}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          
          this.mensagem = response.data.message;
          this.sucesso = true;
          this.arquivoSelecionado = null;
          
          // Limpar o input de arquivo
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = '';
          
          // Emitir evento para atualizar a lista de licitantes
          this.$emit('dados-importados');
          
        } catch (error) {
          console.error('Erro ao importar arquivo:', error);
          this.mensagem = error.response?.data?.error || 'Erro ao importar arquivo';
          this.sucesso = false;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .importacao-container {
    margin: 20px 0;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 5px;
  }
  
  .import-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .alert {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
  }
  
  .alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .alert-danger {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  </style>