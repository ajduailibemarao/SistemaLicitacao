// src/services/ContratacaoService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default {
  // Obter todas as contratações diretas
  getContratacoes() {
    return axios.get(`${API_URL}/contratacoes`);
  },

  // Obter uma contratação direta específica
  getContratacao(id) {
    return axios.get(`${API_URL}/contratacoes/${id}`);
  },

  // Criar uma nova contratação direta
  createContratacao(contratacao) {
    return axios.post(`${API_URL}/contratacoes`, contratacao);
  },

  // Atualizar uma contratação direta existente
  updateContratacao(id, contratacao) {
    return axios.put(`${API_URL}/contratacoes/${id}`, contratacao);
  },

  // Excluir uma contratação direta
  deleteContratacao(id) {
    return axios.delete(`${API_URL}/contratacoes/${id}`);
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