import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

// Adicione estas linhas após a declaração das variáveis globais
const tipoArquivo = document.getElementById('tipo-arquivo');
const arquivoImportacao = document.getElementById('arquivo-importacao');
const btnImportar = document.getElementById('btn-importar');
const mensagemImportacao = document.getElementById('mensagem-importacao');

// Adicione esta função no final do arquivo
// Função de importação
function importarArquivo() {
  if (!arquivoImportacao.files[0]) {
    mostrarMensagemImportacao('Selecione um arquivo para importar', false);
    return;
  }
  
  const formData = new FormData();
  formData.append('arquivo', arquivoImportacao.files[0]);
  
  fetch(`/api/exportacao/licitantes/${tipoArquivo.value}`, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    mostrarMensagemImportacao(data.message, true);
    arquivoImportacao.value = '';
    
    // Recarregar a lista de licitantes
    loadLicitantes();
  })
  .catch(error => {
    console.error('Erro ao importar arquivo:', error);
    mostrarMensagemImportacao('Erro ao importar arquivo', false);
  });
}

function mostrarMensagemImportacao(mensagem, sucesso) {
  mensagemImportacao.textContent = mensagem;
  mensagemImportacao.className = sucesso ? 'alert alert-success' : 'alert alert-danger';
  mensagemImportacao.style.display = 'block';
  
  // Esconder a mensagem após 5 segundos
  setTimeout(() => {
    mensagemImportacao.style.display = 'none';
  }, 5000);
}

// Adicione este event listener na função de inicialização
function init() {
  // Event listeners existentes...
  
  // Event listener para o botão de importação
  if (btnImportar) btnImportar.addEventListener('click', importarArquivo);
  
  // Atualizar a extensão aceita quando o tipo de arquivo mudar
  if (tipoArquivo) {
    tipoArquivo.addEventListener('change', () => {
      arquivoImportacao.accept = tipoArquivo.value === 'json' ? '.json' : '.csv';
    });
    
    // Definir a extensão inicial
    arquivoImportacao.accept = '.json';
  }
}