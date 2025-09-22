import { useState, useEffect } from 'react';
import { vendasAPI, itensVendaAPI, produtosAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import Loading from '../components/Loading';

const Relatorios = () => {
  const [loading, setLoading] = useState(true);
  const [vendas, setVendas] = useState([]);
  const [itensVenda, setItensVenda] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    // Definir datas padrão (hoje)
    const hoje = new Date();
    const dataHoje = hoje.toISOString().split('T')[0];
    setDataInicio(dataHoje);
    setDataFim(dataHoje);

    loadDados();
  }, []);

  const loadDados = async () => {
    try {
      setLoading(true);
      const [vendasRes, itensRes, produtosRes] = await Promise.all([
        vendasAPI.getAll(),
        itensVendaAPI.getAll(),
        produtosAPI.getAll(),
      ]);

      setVendas(vendasRes.data);
      setItensVenda(itensRes.data);
      setProdutos(produtosRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados dos relatórios');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar vendas por período
  const vendasFiltradas = vendas.filter((venda) => {
    const dataVenda = new Date(venda.data).toISOString().split('T')[0];
    return dataVenda >= dataInicio && dataVenda <= dataFim;
  });

  // Calcular estatísticas do período
  const totalVendas = vendasFiltradas.length;
  const faturamentoTotal = vendasFiltradas.reduce(
    (total, venda) => total + venda.total,
    0,
  );
  const ticketMedio = totalVendas > 0 ? faturamentoTotal / totalVendas : 0;

  // Produtos mais vendidos no período
  const produtosMaisVendidos = () => {
    const vendidosPorProduto = {};

    vendasFiltradas.forEach((venda) => {
      const itensVendaVenda = itensVenda.filter(
        (item) => item.vendaId === venda.id,
      );
      itensVendaVenda.forEach((item) => {
        if (vendidosPorProduto[item.produtoId]) {
          vendidosPorProduto[item.produtoId].quantidade += item.quantidade;
          vendidosPorProduto[item.produtoId].faturamento += item.subtotal;
        } else {
          const produto = produtos.find((p) => p.id === item.produtoId);
          vendidosPorProduto[item.produtoId] = {
            produto: produto ? produto.nome : 'Produto não encontrado',
            codigo: produto ? produto.codigo : 'N/A',
            quantidade: item.quantidade,
            faturamento: item.subtotal,
            unidade: produto ? produto.unidade : 'un',
          };
        }
      });
    });

    return Object.values(vendidosPorProduto)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  };

  // Vendas por dia
  const vendasPorDia = () => {
    const vendaPortDia = {};

    vendasFiltradas.forEach((venda) => {
      const dia = new Date(venda.data).toISOString().split('T')[0];
      if (vendaPortDia[dia]) {
        vendaPortDia[dia].vendas += 1;
        vendaPortDia[dia].faturamento += venda.total;
      } else {
        vendaPortDia[dia] = {
          data: dia,
          vendas: 1,
          faturamento: venda.total,
        };
      }
    });

    return Object.values(vendaPortDia).sort(
      (a, b) => new Date(a.data) - new Date(b.data),
    );
  };

  const gerarRelatorioDiario = async () => {
    const hoje = new Date().toISOString().split('T')[0];
    const vendasHoje = vendas.filter(
      (venda) => new Date(venda.data).toISOString().split('T')[0] === hoje,
    );

    const totalVendasHoje = vendasHoje.length;
    const faturamentoHoje = vendasHoje.reduce(
      (total, venda) => total + venda.total,
      0,
    );

    alert(
      `Relatório Diário (${formatDate(hoje)}):\n\n` +
        `Total de Vendas: ${totalVendasHoje}\n` +
        `Faturamento: ${formatCurrency(faturamentoHoje)}\n` +
        `Ticket Médio: ${formatCurrency(
          totalVendasHoje > 0 ? faturamentoHoje / totalVendasHoje : 0,
        )}`,
    );
  };

  const produtosMaisVendidosList = produtosMaisVendidos();
  const vendasPorDiaList = vendasPorDia();

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Relatórios
        </h1>
        <p className="text-gray-600 mt-2">
          Análise de vendas e performance do armazém
        </p>
      </div>

      {/* Filtros de período */}
      <div className="bg-white rounded-lg shadow p-4 lg:p-6 mb-6 lg:mb-8">
        <h2 className="text-lg lg:text-xl font-bold mb-4">
          Período de Análise
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Início
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data Fim
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                const hoje = new Date().toISOString().split('T')[0];
                setDataInicio(hoje);
                setDataFim(hoje);
              }}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm lg:text-base"
            >
              Hoje
            </button>
            <button
              onClick={gerarRelatorioDiario}
              className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm lg:text-base"
            >
              Fechar Dia
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-2 lg:p-3">
              <span className="text-white text-lg lg:text-2xl">🛒</span>
            </div>
            <div className="ml-3 lg:ml-4">
              <h3 className="text-xs lg:text-sm font-medium text-gray-500">
                Total de Vendas
              </h3>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {totalVendas}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-2 lg:p-3">
              <span className="text-white text-lg lg:text-2xl">💰</span>
            </div>
            <div className="ml-3 lg:ml-4">
              <h3 className="text-xs lg:text-sm font-medium text-gray-500">
                Faturamento Total
              </h3>
              <p className="text-lg lg:text-2xl font-bold text-gray-900">
                {formatCurrency(faturamentoTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3">
              <span className="text-white text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Ticket Médio
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(ticketMedio)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Produtos mais vendidos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Produtos Mais Vendidos</h2>
          {produtosMaisVendidosList.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Nenhuma venda no período selecionado
            </div>
          ) : (
            <div className="space-y-3">
              {produtosMaisVendidosList.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{item.produto}</div>
                      <div className="text-sm text-gray-500">{item.codigo}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {item.quantidade} {item.unidade}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(item.faturamento)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vendas por dia */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Vendas por Dia</h2>
          {vendasPorDiaList.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Nenhuma venda no período selecionado
            </div>
          ) : (
            <div className="space-y-3">
              {vendasPorDiaList.map((dia, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{formatDate(dia.data)}</div>
                    <div className="text-sm text-gray-500">
                      {dia.vendas} vendas
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {formatCurrency(dia.faturamento)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Média: {formatCurrency(dia.faturamento / dia.vendas)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lista detalhada de vendas */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Vendas Detalhadas</h2>
        {vendasFiltradas.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Nenhuma venda no período selecionado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Itens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendasFiltradas.map((venda) => (
                  <tr key={venda.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(venda.data).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {venda.itens} itens
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(venda.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Relatorios;
