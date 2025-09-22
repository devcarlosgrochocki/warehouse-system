// Mock API usando localStorage para demonstração online
class MockAPI {
  constructor() {
    this.baseKey = 'warehouse_';
    this.initializeData();
  }

  initializeData() {
    // Inicializar dados se não existirem
    if (!localStorage.getItem(this.baseKey + 'produtos')) {
      const initialData = {
        produtos: [
          {
            id: 'prod001',
            nome: 'Arroz Branco 5kg',
            codigo: 'ARR001',
            preco: 25.9,
            estoque: 50,
            categoria: 'Alimentos',
            unidade: 'unidade',
          },
          {
            id: 'prod002',
            nome: 'Feijão Preto 1kg',
            codigo: 'FEI001',
            preco: 8.5,
            estoque: 30,
            categoria: 'Alimentos',
            unidade: 'unidade',
          },
          {
            id: 'prod003',
            nome: 'Carne Bovina',
            codigo: 'CAR001',
            preco: 32.9,
            estoque: 15,
            categoria: 'Alimentos',
            unidade: 'kg',
          },
          {
            id: 'prod004',
            nome: 'Detergente Líquido',
            codigo: 'DET001',
            preco: 3.5,
            estoque: 8,
            categoria: 'Limpeza',
            unidade: 'unidade',
          },
          {
            id: 'prod005',
            nome: 'Leite Integral 1L',
            codigo: 'LEI001',
            preco: 4.8,
            estoque: 25,
            categoria: 'Bebidas',
            unidade: 'unidade',
          },
        ],
        vendas: [
          {
            id: 'venda001',
            data: '2025-09-21T10:30:00.000Z',
            total: 47.9,
            itens: 3,
          },
        ],
        itensVenda: [
          {
            id: 'item001',
            vendaId: 'venda001',
            produtoId: 'prod001',
            quantidade: 1,
            preco: 25.9,
            subtotal: 25.9,
          },
          {
            id: 'item002',
            vendaId: 'venda001',
            produtoId: 'prod002',
            quantidade: 2,
            preco: 8.5,
            subtotal: 17.0,
          },
          {
            id: 'item003',
            vendaId: 'venda001',
            produtoId: 'prod005',
            quantidade: 1,
            preco: 4.8,
            subtotal: 4.8,
          },
        ],
        relatorios: [],
        usuario: {
          id: 1,
          nome: 'Administrador',
          email: 'admin@warehouse.com',
        },
      };

      Object.keys(initialData).forEach((key) => {
        localStorage.setItem(
          this.baseKey + key,
          JSON.stringify(initialData[key]),
        );
      });
    }
  }

  get(endpoint) {
    const key = endpoint.replace('/', '');
    const data = localStorage.getItem(this.baseKey + key);
    return Promise.resolve({ data: JSON.parse(data || '[]') });
  }

  post(endpoint, data) {
    const key = endpoint.replace('/', '');
    const existing = JSON.parse(
      localStorage.getItem(this.baseKey + key) || '[]',
    );
    existing.push(data);
    localStorage.setItem(this.baseKey + key, JSON.stringify(existing));
    return Promise.resolve({ data });
  }

  put(endpoint, data) {
    const [collection, id] = endpoint.replace('/', '').split('/');
    const existing = JSON.parse(
      localStorage.getItem(this.baseKey + collection) || '[]',
    );
    const index = existing.findIndex((item) => item.id === id);
    if (index !== -1) {
      existing[index] = data;
      localStorage.setItem(this.baseKey + collection, JSON.stringify(existing));
    }
    return Promise.resolve({ data });
  }

  delete(endpoint) {
    const [collection, id] = endpoint.replace('/', '').split('/');
    const existing = JSON.parse(
      localStorage.getItem(this.baseKey + collection) || '[]',
    );
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(this.baseKey + collection, JSON.stringify(filtered));
    return Promise.resolve({ data: { message: 'Deleted' } });
  }
}

export default MockAPI;
