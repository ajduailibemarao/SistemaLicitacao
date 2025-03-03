<template>
  <div id="app">
    <header>
      <h1>Sistema de Controle de Licitações</h1>
      <nav>
        <div class="nav-group">
          <button @click="currentView = 'dashboard'" :class="{ active: currentView === 'dashboard' }">
            Dashboard
          </button>
          <button @click="currentView = 'relatorios'" :class="{ active: currentView === 'relatorios' }">
            Relatórios
          </button>
        </div>
        
        <div class="nav-group">
          <button @click="currentView = 'licitantes-form'" :class="{ active: currentView === 'licitantes-form' }">
            Cadastrar Licitante
          </button>
          <button @click="currentView = 'licitantes-list'" :class="{ active: currentView === 'licitantes-list' }">
            Listar Licitantes
          </button>
        </div>
        
        <div class="nav-group">
          <button @click="currentView = 'licitacoes-form'" :class="{ active: currentView === 'licitacoes-form' }">
            Cadastrar Licitação
          </button>
          <button @click="currentView = 'licitacoes-list'" :class="{ active: currentView === 'licitacoes-list' }">
            Listar Licitações
          </button>
        </div>
        
        <div class="nav-group">
          <button @click="currentView = 'contratacoes-form'" :class="{ active: currentView === 'contratacoes-form' }">
            Cadastrar Contratação
          </button>
          <button @click="currentView = 'contratacoes-list'" :class="{ active: currentView === 'contratacoes-list' }">
            Listar Contratações
          </button>
        </div>
        
        <div class="nav-group">
          <button @click="currentView = 'penalidades-form'" :class="{ active: currentView === 'penalidades-form' }">
            Cadastrar Penalidade
          </button>
          <button @click="currentView = 'penalidades-list'" :class="{ active: currentView === 'penalidades-list' }">
            Listar Penalidades
          </button>
        </div>
      </nav>
    </header>
    
    <main>
      <Dashboard v-if="currentView === 'dashboard'" />
      <RelatorioForm v-if="currentView === 'relatorios'" />
      
      <LicitanteForm v-if="currentView === 'licitantes-form'" @licitante-saved="currentView = 'licitantes-list'" />
      <LicitanteList v-if="currentView === 'licitantes-list'" @edit-licitante="editLicitante" />
      
      <LicitacaoForm v-if="currentView === 'licitacoes-form'" :licitacaoId="selectedLicitacaoId" @licitacao-saved="currentView = 'licitacoes-list'" @cancel="cancelLicitacaoForm" />
      <LicitacaoList v-if="currentView === 'licitacoes-list'" @edit-licitacao="editLicitacao" />
      
      <ContratacaoForm v-if="currentView === 'contratacoes-form'" :contratacaoId="selectedContratacaoId" @contratacao-saved="currentView = 'contratacoes-list'" @cancel="cancelContratacaoForm" />
      <ContratacaoList v-if="currentView === 'contratacoes-list'" @edit-contratacao="editContratacao" />
      
      <PenalidadeForm v-if="currentView === 'penalidades-form'" :penalidadeId="selectedPenalidadeId" @penalidade-saved="currentView = 'penalidades-list'" @cancel="cancelPenalidadeForm" />
      <PenalidadeList v-if="currentView === 'penalidades-list'" @edit-penalidade="editPenalidade" />
    </main>
  </div>
</template>

<script>
import LicitanteForm from './components/LicitanteForm.vue'
import LicitanteList from './components/LicitanteList.vue'
import LicitacaoForm from './components/LicitacaoForm.vue'
import LicitacaoList from './components/LicitacaoList.vue'
import ContratacaoForm from './components/ContratacaoForm.vue'
import ContratacaoList from './components/ContratacaoList.vue'
import PenalidadeForm from './components/PenalidadeForm.vue'
import PenalidadeList from './components/PenalidadeList.vue'
import Dashboard from './components/Dashboard.vue'
import RelatorioForm from './components/RelatorioForm.vue'

export default {
  name: 'App',
  components: {
    LicitanteForm,
    LicitanteList,
    LicitacaoForm,
    LicitacaoList,
    ContratacaoForm,
    ContratacaoList,
    PenalidadeForm,
    PenalidadeList,
    Dashboard,
    RelatorioForm
  },
  data() {
    return {
      currentView: 'dashboard',
      selectedLicitacaoId: null,
      selectedContratacaoId: null,
      selectedPenalidadeId: null
    }
  },
  methods: {
    editLicitante(licitante) {
      // Implementar a edição de licitante
      alert(`Edição de licitante será implementada em breve: ${licitante.razao_social}`);
    },
    editLicitacao(id) {
      this.selectedLicitacaoId = id;
      this.currentView = 'licitacoes-form';
    },
    cancelLicitacaoForm() {
      this.selectedLicitacaoId = null;
      this.currentView = 'licitacoes-list';
    },
    editContratacao(id) {
      this.selectedContratacaoId = id;
      this.currentView = 'contratacoes-form';
    },
    cancelContratacaoForm() {
      this.selectedContratacaoId = null;
      this.currentView = 'contratacoes-list';
    },
    editPenalidade(id) {
      this.selectedPenalidadeId = id;
      this.currentView = 'penalidades-form';
    },
    cancelPenalidadeForm() {
      this.selectedPenalidadeId = null;
      this.currentView = 'penalidades-list';
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
}

h1 {
  margin-top: 0;
  margin-bottom: 1rem;
}

nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.nav-group {
  display: flex;
  gap: 5px;
  margin-bottom: 5px;
}

nav button {
  padding: 8px 16px;
  background-color: #34495e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

nav button.active {
  background-color: #3498db;
}

nav button:hover {
  background-color: #2980b9;
}

main {
  padding: 20px;
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

@media (max-width: 768px) {
  .nav-group {
    flex-direction: column;
    width: 100%;
  }
  
  nav button {
    width: 100%;
  }
}
</style>