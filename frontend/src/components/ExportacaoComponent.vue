<!-- src/components/ExportacaoComponent.vue -->
<template>
    <div class="exportacao-container">
      <h3>Exportar Dados</h3>
      <div class="export-buttons">
        <button @click="exportarExcel" class="btn btn-primary">
          <i class="fas fa-file-excel"></i> Exportar para Excel
        </button>
        <button @click="exportarPDF" class="btn btn-primary">
          <i class="fas fa-file-pdf"></i> Exportar para PDF
        </button>
        <button @click="exportarWord" class="btn btn-primary">
          <i class="fas fa-file-word"></i> Exportar para Word
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ExportacaoComponent',
    methods: {
      async exportarExcel() {
        try {
          const response = await axios.get('http://localhost:3000/api/exportacao/licitacoes/excel', {
            responseType: 'blob'
          });
          
          this.downloadFile(response.data, 'licitacoes.xlsx');
        } catch (error) {
          console.error('Erro ao exportar para Excel:', error);
          alert('Erro ao exportar para Excel');
        }
      },
      
      async exportarPDF() {
        try {
          const response = await axios.get('http://localhost:3000/api/exportacao/licitacoes/pdf', {
            responseType: 'blob'
          });
          
          this.downloadFile(response.data, 'licitacoes.pdf');
        } catch (error) {
          console.error('Erro ao exportar para PDF:', error);
          alert('Erro ao exportar para PDF');
        }
      },
      
      async exportarWord() {
        try {
          const response = await axios.get('http://localhost:3000/api/exportacao/licitacoes/word', {
            responseType: 'blob'
          });
          
          this.downloadFile(response.data, 'licitacoes.docx');
        } catch (error) {
          console.error('Erro ao exportar para Word:', error);
          alert('Erro ao exportar para Word');
        }
      },
      
      downloadFile(data, filename) {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  </script>
  
  <style scoped>
  .exportacao-container {
    margin: 20px 0;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 5px;
  }
  
  .export-buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  
  .btn {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  </style>