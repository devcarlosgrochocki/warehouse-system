import { useState, useEffect } from 'react';
import { produtosAPI, vendasAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import Loading from '../components/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    vendasHoje: 0,
    faturamentoHoje: 0,
    produtosBaixoEstoque: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Carregar produtos
      const produtosResponse = await produtosAPI.getAll();
      const produtos = produtosResponse.data;

      // Carregar vendas
      const vendasResponse = await vendasAPI.getAll();
      const vendas = vendasResponse.data;

      // Calcular estatísticas
      const hoje = new Date().toDateString();
      const vendasHoje = vendas.filter(
        (venda) => new Date(venda.data).toDateString() === hoje,
      );

      const faturamentoHoje = vendasHoje.reduce(
        (total, venda) => total + venda.total,
        0,
      );

      const produtosBaixoEstoque = produtos.filter(
        (produto) => produto.estoque <= 10,
      ).length;

      setStats({
        totalProdutos: produtos.length,
        vendasHoje: vendasHoje.length,
        faturamentoHoje,
        produtosBaixoEstoque,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const statsCards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProdutos,
      icon: '📦',
      color: 'bg-blue-500',
    },
    {
      title: 'Vendas Hoje',
      value: stats.vendasHoje,
      icon: '💰',
      color: 'bg-green-500',
    },
    {
      title: 'Faturamento Hoje',
      value: formatCurrency(stats.faturamentoHoje),
      icon: '💵',
      color: 'bg-yellow-500',
    },
    {
      title: 'Produtos Baixo Estoque',
      value: stats.produtosBaixoEstoque,
      icon: '⚠️',
      color: 'bg-red-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do seu armazém</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${card.color} rounded-lg p-3`}>
                <span className="text-white text-2xl">{card.icon}</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ações rápidas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => (window.location.href = '/produtos')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl mr-2">📦</span>
            <span className="font-medium">Adicionar Produto</span>
          </button>

          <button
            onClick={() => (window.location.href = '/vendas')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <span className="text-2xl mr-2">💰</span>
            <span className="font-medium">Nova Venda</span>
          </button>

          <button
            onClick={() => (window.location.href = '/relatorios')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <span className="text-2xl mr-2">📈</span>
            <span className="font-medium">Ver Relatórios</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
