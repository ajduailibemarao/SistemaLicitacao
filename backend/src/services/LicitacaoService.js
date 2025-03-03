// src/services/LicitacaoService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default {
  // Obter todas as licitações
  getLicitacoes() {
    return axios.get(`${API_URL}/licitacoes`);
  },

  // Obter uma licitação específica
  getLicitacao(id) {
    return axios.get(`${API_URL}/licitacoes/${id}`);
  },

  // Criar uma nova licitação
  createLicitacao(licitacao) {
    return axios.post(`${API_URL}/licitacoes`, licitacao);
  },

  // Atualizar uma licitação existente
  updateLicitacao(id, licitacao) {
    return axios.put(`${API_URL}/licitacoes/${id}`, licitacao);
  },

  // Excluir uma licitação
  deleteLicitacao(id) {
    return axios.delete(`${API_URL}/licitacoes/${id}`);
  },

  // Obter dados para o formulário (modalidades, tipos, etc.)
  getFormData() {
    return axios.all([
      axios.get(`${API_URL}/modalidades`),
      axios.get(`${API_URL}/tipos`),
      axios.get(`${API_URL}/setores`),
      axios.get(`${API_URL}/diretorias`),
      axios.get(`${API_URL}/licitantes`)
    ]).then(axios.spread((modalidades, tipos, setores, diretorias, licitantes) => {
      return {
        modalidades: modalidades.data,
        tipos: tipos.data,
        setores: setores.data,
        diretorias: diretorias.data,
        licitantes: licitantes.data
      };
    }));
  }
};