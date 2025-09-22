import axios from 'axios';

// Configuração da API baseada no ambiente
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3002' 
  : 'https://my-json-server.typicode.com/warehouse-demo/warehouse-api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  getByVendaId: (vendaId) => api.get(`/itensVenda?vendaId=${vendaId}`),
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