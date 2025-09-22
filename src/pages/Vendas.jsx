import { useState, useEffect } from 'react';
import { produtosAPI, vendasAPI, itensVendaAPI } from '../services/api';
import {
  formatCurrency,
  generateId,
  calculateSaleTotal,
} from '../utils/helpers';
import Loading from '../components/Loading';

const Vendas = () => {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState('');

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      const response = await produtosAPI.getAll();
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      alert('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  const adicionarAoCarrinho = () => {
    if (!produtoSelecionado || !quantidade || parseFloat(quantidade) <= 0) {
      alert('Selecione um produto e informe a quantidade');
      return;
    }

    const qtd = parseFloat(quantidade);

    if (qtd > produtoSelecionado.estoque) {
      alert('Quantidade superior ao estoque disponível');
      return;
    }

    const itemExistente = carrinho.find(
      (item) => item.produtoId === produtoSelecionado.id,
    );

    if (itemExistente) {
      const novaQuantidade = itemExistente.quantidade + qtd;
      if (novaQuantidade > produtoSelecionado.estoque) {
        alert('Quantidade total superior ao estoque disponível');
        return;
      }

      setCarrinho(
        carrinho.map((item) =>
          item.produtoId === produtoSelecionado.id
            ? {
                ...item,
                quantidade: novaQuantidade,
                subtotal: novaQuantidade * item.preco,
              }
            : item,
        ),
      );
    } else {
      const novoItem = {
        id: generateId(),
        produtoId: produtoSelecionado.id,
        nome: produtoSelecionado.nome,
        codigo: produtoSelecionado.codigo,
        preco: produtoSelecionado.preco,
        quantidade: qtd,
        unidade: produtoSelecionado.unidade,
        subtotal: qtd * produtoSelecionado.preco,
      };
      setCarrinho([...carrinho, novoItem]);
    }

    setProdutoSelecionado(null);
    setQuantidade('');
    setPesquisa('');
  };

  const removerDoCarrinho = (itemId) => {
    setCarrinho(carrinho.filter((item) => item.id !== itemId));
  };

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      alert('Adicione produtos ao carrinho');
      return;
    }

    try {
      const total = calculateSaleTotal(carrinho);
      const vendaId = generateId();

      // Criar venda
      const venda = {
        id: vendaId,
        data: new Date().toISOString(),
        total: total,
        itens: carrinho.length,
      };

      await vendasAPI.create(venda);

      // Criar itens da venda
      for (const item of carrinho) {
        const itemVenda = {
          id: generateId(),
          vendaId: vendaId,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          preco: item.preco,
          subtotal: item.subtotal,
        };
        await itensVendaAPI.create(itemVenda);

        // Atualizar estoque do produto
        const produto = produtos.find((p) => p.id === item.produtoId);
        if (produto) {
          await produtosAPI.update(produto.id, {
            ...produto,
            estoque: produto.estoque - item.quantidade,
          });
        }
      }

      alert(`Venda finalizada com sucesso!\nTotal: ${formatCurrency(total)}`);
      setCarrinho([]);
      await loadProdutos(); // Recarregar produtos para atualizar estoque
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      alert('Erro ao finalizar venda');
    }
  };

  const totalVenda = calculateSaleTotal(carrinho);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Ponto de Venda (POS)
        </h1>
        <p className="text-gray-600 mt-2">Sistema de vendas do armazém</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-8">
        {/* Seleção de produtos */}
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-4">
            Adicionar Produtos
          </h2>

          {/* Pesquisa */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Pesquisar produto por nome ou código..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm lg:text-base"
            />
          </div>

          {/* Lista de produtos */}
          <div className="max-h-80 lg:max-h-96 overflow-y-auto space-y-2">
            {produtosFiltrados.map((produto) => (
              <div
                key={produto.id}
                onClick={() => setProdutoSelecionado(produto)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  produtoSelecionado?.id === produto.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                } ${produto.estoque === 0 ? 'opacity-50' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm lg:text-base truncate">
                      {produto.nome}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-500">
                      {produto.codigo} - {formatCurrency(produto.preco)} /{' '}
                      {produto.unidade}
                    </div>
                  </div>
                  <div className="text-xs lg:text-sm ml-2 flex-shrink-0">
                    <span
                      className={`${
                        produto.estoque <= 10
                          ? 'text-red-600 font-bold'
                          : 'text-gray-600'
                      }`}
                    >
                      Est: {produto.estoque}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Adicionar quantidade */}
          {produtoSelecionado && (
            <div className="mt-4 p-3 lg:p-4 bg-blue-50 rounded-lg">
              <div className="mb-2">
                <strong className="text-sm lg:text-base">
                  {produtoSelecionado.nome}
                </strong>
                <br />
                <span className="text-xs lg:text-sm text-gray-600">
                  {formatCurrency(produtoSelecionado.preco)} por{' '}
                  {produtoSelecionado.unidade}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="number"
                  placeholder="Quantidade"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  min="0.01"
                  step={produtoSelecionado.unidade === 'kg' ? '0.01' : '1'}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm lg:text-base"
                />
                <button
                  onClick={adicionarAoCarrinho}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm lg:text-base"
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Carrinho */}
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-4">
            Carrinho de Compras
          </h2>

          {carrinho.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm lg:text-base">
              Carrinho vazio
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-80 lg:max-h-96 overflow-y-auto">
                {carrinho.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm lg:text-base truncate">
                        {item.nome}
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500">
                        {item.quantidade} {item.unidade} ×{' '}
                        {formatCurrency(item.preco)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                      <span className="font-bold text-sm lg:text-base">
                        {formatCurrency(item.subtotal)}
                      </span>
                      <button
                        onClick={() => removerDoCarrinho(item.id)}
                        className="text-red-600 hover:text-red-800 text-lg lg:text-xl w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 lg:mt-6 pt-4 border-t">
                <div className="flex justify-between items-center text-lg lg:text-xl font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(totalVenda)}</span>
                </div>

                <button
                  onClick={finalizarVenda}
                  className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold text-base lg:text-lg"
                >
                  Finalizar Venda
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vendas;
