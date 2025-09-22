// Formatação de moeda brasileira
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Formatação de data brasileira
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

// Formatação de data e hora brasileira
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// Gerar ID único
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validar código de produto
export const validateProductCode = (code) => {
  return /^[A-Z0-9]{3,10}$/.test(code);
};

// Calcular total da venda
export const calculateSaleTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.preco * item.quantidade);
  }, 0);
};