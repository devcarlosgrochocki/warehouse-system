import axios from 'axios';
import MockAPI from './mockAPI';

// Configuração da API baseada no ambiente
const isDev = import.meta.env.DEV;
const API_BASE_URL = 'http://localhost:3002';

let api;

if (isDev) {
  // Desenvolvimento: usar JSON Server
  api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} else {
  // Produção: usar MockAPI com localStorage
  api = new MockAPI();
}

// Produtos
export const produtosAPI = {
  getAll: () => api.get('/produtos'),
  getById: (id) => api.get(`/produtos/${id}`),
  create: (produto) => api.post('/produtos', produto),
  update: (id, produto) => api.put(`/produtos/${id}`, produto),
  delete: (id) => api.delete(`/produtos/${id}`),
};

// Vendas
export const vendasAPI = {
  getAll: () => api.get('/vendas'),
  getById: (id) => api.get(`/vendas/${id}`),
  create: (venda) => api.post('/vendas', venda),
  update: (id, venda) => api.put(`/vendas/${id}`, venda),
  delete: (id) => api.delete(`/vendas/${id}`),
};

// Itens de Venda
export const itensVendaAPI = {
  getAll: () => api.get('/itensVenda'),
  getByVendaId: (vendaId) => {
    if (isDev) {
      return api.get(`/itensVenda?vendaId=${vendaId}`);
    } else {
      return api.get('/itensVenda').then((response) => ({
        data: response.data.filter((item) => item.vendaId === vendaId),
      }));
    }
  },
  create: (item) => api.post('/itensVenda', item),
  update: (id, item) => api.put(`/itensVenda/${id}`, item),
  delete: (id) => api.delete(`/itensVenda/${id}`),
};

// Relatórios
export const relatoriosAPI = {
  getAll: () => api.get('/relatorios'),
  create: (relatorio) => api.post('/relatorios', relatorio),
};

export default api;
