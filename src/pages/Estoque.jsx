import { useState, useEffect } from 'react';
import { produtosAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import Loading from '../components/Loading';

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAjusteModal, setShowAjusteModal] = useState(false);
  const [produtoAjuste, setProdutoAjuste] = useState(null);
  const [tipoAjuste, setTipoAjuste] = useState('entrada'); // entrada ou saida
  const [quantidadeAjuste, setQuantidadeAjuste] = useState('');
  const [motivoAjuste, setMotivoAjuste] = useState('');

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

  const abrirModalAjuste = (produto) => {
    setProdutoAjuste(produto);
    setShowAjusteModal(true);
    setQuantidadeAjuste('');
    setMotivoAjuste('');
  };

  const handleAjusteEstoque = async (e) => {
    e.preventDefault();
    
    if (!quantidadeAjuste || parseFloat(quantidadeAjuste) <= 0) {
      alert('Informe uma quantidade válida');
      return;
    }

    if (!motivoAjuste.trim()) {
      alert('Informe o motivo do ajuste');
      return;
    }

    try {
      const quantidade = parseFloat(quantidadeAjuste);
      let novoEstoque = produtoAjuste.estoque;
      
      if (tipoAjuste === 'entrada') {
        novoEstoque += quantidade;
      } else {
        novoEstoque -= quantidade;
        if (novoEstoque < 0) {
          alert('Estoque não pode ficar negativo');
          return;
        }
      }

      await produtosAPI.update(produtoAjuste.id, {
        ...produtoAjuste,
        estoque: novoEstoque
      });

      await loadProdutos();
      setShowAjusteModal(false);
      setProdutoAjuste(null);
      
      alert(`Ajuste realizado com sucesso!\nEstoque anterior: ${produtoAjuste.estoque}\nNovo estoque: ${novoEstoque}`);
      
    } catch (error) {
      console.error('Erro ao ajustar estoque:', error);
      alert('Erro ao ajustar estoque');
    }
  };

  const getStatusEstoque = (estoque) => {
    if (estoque === 0) return { status: 'Sem Estoque', color: 'bg-red-100 text-red-800' };
    if (estoque <= 10) return { status: 'Baixo Estoque', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Normal', color: 'bg-green-100 text-green-800' };
  };

  // Estatísticas do estoque
  const totalProdutos = produtos.length;
  const produtosSemEstoque = produtos.filter(p => p.estoque === 0).length;
  const produtosBaixoEstoque = produtos.filter(p => p.estoque > 0 && p.estoque <= 10).length;
  const valorTotalEstoque = produtos.reduce((total, produto) => total + (produto.preco * produto.estoque), 0);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Controle de Estoque</h1>
        <p className="text-gray-600 mt-2">Gerencie e ajuste os estoques dos produtos</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3">
              <span className="text-white text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total de Produtos</h3>
              <p className="text-2xl font-bold text-gray-900">{totalProdutos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-red-500 rounded-lg p-3">
              <span className="text-white text-2xl">❌</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Sem Estoque</h3>
              <p className="text-2xl font-bold text-gray-900">{produtosSemEstoque}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-lg p-3">
              <span className="text-white text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Baixo Estoque</h3>
              <p className="text-2xl font-bold text-gray-900">{produtosBaixoEstoque}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3">
              <span className="text-white text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(valorTotalEstoque)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de estoque */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque Atual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {produtos.map((produto) => {
              const status = getStatusEstoque(produto.estoque);
              return (
                <tr key={produto.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                    <div className="text-sm text-gray-500">{formatCurrency(produto.preco)} / {produto.unidade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {produto.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {produto.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                    {produto.estoque} {produto.unidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                      {status.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(produto.preco * produto.estoque)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => abrirModalAjuste(produto)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ajustar Estoque
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {produtos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum produto cadastrado
          </div>
        )}
      </div>

      {/* Modal de Ajuste de Estoque */}
      {showAjusteModal && produtoAjuste && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Ajustar Estoque</h2>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="font-medium">{produtoAjuste.nome}</div>
              <div className="text-sm text-gray-600">Estoque atual: {produtoAjuste.estoque} {produtoAjuste.unidade}</div>
            </div>
            
            <form onSubmit={handleAjusteEstoque} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Ajuste</label>
                <select
                  value={tipoAjuste}
                  onChange={(e) => setTipoAjuste(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="entrada">Entrada (Adicionar)</option>
                  <option value="saida">Saída (Remover)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                <input
                  type="number"
                  step={produtoAjuste.unidade === 'kg' ? '0.01' : '1'}
                  min="0.01"
                  required
                  value={quantidadeAjuste}
                  onChange={(e) => setQuantidadeAjuste(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Motivo do Ajuste</label>
                <textarea
                  required
                  value={motivoAjuste}
                  onChange={(e) => setMotivoAjuste(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                  placeholder="Ex: Recebimento de mercadoria, correção de inventário..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAjusteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estoque;