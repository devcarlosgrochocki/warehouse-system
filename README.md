# Sistema de Armazém

Sistema completo de gerenciamento de armazém desenvolvido com React.js, Vite, Tailwind CSS e JSON Server.

## 🚀 Funcionalidades

### 📦 Gestão de Produtos
- Cadastro de produtos com nome, código, preço, estoque e categoria
- Venda por unidade ou por quilograma (kg)
- Validação de códigos de produto
- Edição e exclusão de produtos

### 💰 Sistema de Vendas (POS)
- Interface de ponto de venda intuitiva
- Pesquisa de produtos por nome ou código
- Carrinho de compras com cálculo automático
- Baixa automática no estoque
- Suporte a vendas por unidade e peso

### 📋 Controle de Estoque
- Visualização do estoque atual de todos os produtos
- Alertas para produtos com baixo estoque
- Ajustes manuais de estoque (entrada/saída)
- Histórico de ajustes com motivos
- Cálculo do valor total do estoque

### 📈 Relatórios Gerenciais
- Dashboard com estatísticas gerais
- Relatórios de vendas por período
- Produtos mais vendidos
- Análise de faturamento
- Fechamento diário
- Ticket médio de vendas

### 👤 Administração
- Sistema com usuário administrador único
- Interface responsiva e moderna
- Navegação intuitiva entre módulos

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React.js 19.1.1 + Vite 7.1.6
- **Styling:** Tailwind CSS 4.1.13
- **Roteamento:** React Router Dom 7.9.1
- **Requisições HTTP:** Axios 1.12.2
- **Backend/API:** JSON Server 1.0.0-beta.3
- **Execução Concorrente:** Concurrently 9.2.1

## 📁 Estrutura do Projeto

```
warehouse-system/
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Layout.jsx       # Layout principal com sidebar
│   │   └── Loading.jsx      # Componente de loading
│   ├── pages/               # Páginas principais
│   │   ├── Dashboard.jsx    # Painel principal
│   │   ├── Produtos.jsx     # Gestão de produtos
│   │   ├── Vendas.jsx       # Sistema POS
│   │   ├── Estoque.jsx      # Controle de estoque
│   │   └── Relatorios.jsx   # Relatórios
│   ├── services/            # Serviços de API
│   │   └── api.js          # Configuração Axios + endpoints
│   ├── utils/               # Utilitários
│   │   └── helpers.js      # Funções auxiliares
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Ponto de entrada
│   └── index.css           # Estilos globais + Tailwind
├── db.json                 # Banco de dados JSON Server
├── package.json            # Dependências e scripts
├── tailwind.config.js      # Configuração Tailwind
├── postcss.config.js       # Configuração PostCSS
└── README.md              # Documentação
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Passos para execução

1. **Clone ou baixe o projeto:**
   ```bash
   cd warehouse-system
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o projeto:**
   ```bash
   npm run dev
   ```

Este comando iniciará simultaneamente:
- Frontend React (Vite) em `http://localhost:5173`
- JSON Server API em `http://localhost:3001`

## 🌐 Deploy Online (Gratuito)

### Deploy Rápido no Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login
2. Conecte este repositório GitHub
3. Deploy automático!

### Outras opções gratuitas:
- **Netlify**: [netlify.com](https://netlify.com)
- **GitHub Pages**: Ideal para projetos estáticos
- **Railway**: Para projetos full-stack

📋 **Ver guia completo**: [DEPLOY.md](./DEPLOY.md)

### Scripts Disponíveis

- `npm run dev` - Executa frontend + backend simultaneamente
- `npm run client` - Executa apenas o frontend
- `npm run server` - Executa apenas o JSON Server
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção

## 💾 Estrutura de Dados

### Produtos
```json
{
  "id": "string",
  "nome": "string",
  "codigo": "string",
  "preco": "number",
  "estoque": "number",
  "categoria": "string",
  "unidade": "unidade|kg"
}
```

### Vendas
```json
{
  "id": "string",
  "data": "ISO 8601 string",
  "total": "number",
  "itens": "number"
}
```

### Itens de Venda
```json
{
  "id": "string",
  "vendaId": "string",
  "produtoId": "string",
  "quantidade": "number",
  "preco": "number",
  "subtotal": "number"
}
```

## 🎯 Como Usar

### 1. Cadastro de Produtos
- Acesse "Produtos" no menu lateral
- Clique em "Novo Produto"
- Preencha os dados (nome, código, categoria, preço, estoque)
- Escolha se a venda é por unidade ou quilograma

### 2. Realizar Vendas
- Acesse "Vendas (POS)"
- Pesquise produtos por nome ou código
- Selecione o produto e informe a quantidade
- Adicione ao carrinho
- Finalize a venda

### 3. Controlar Estoque
- Acesse "Estoque"
- Visualize produtos com baixo estoque
- Realize ajustes manuais quando necessário
- Informe o motivo do ajuste

### 4. Gerar Relatórios
- Acesse "Relatórios"
- Selecione o período desejado
- Visualize vendas, faturamento e produtos mais vendidos
- Use "Fechar Dia" para relatório diário

## 🔧 Configurações

### Personalizar Categorias
Edite o array `categorias` em `src/pages/Produtos.jsx`:
```javascript
const categorias = [
  'Alimentos',
  'Bebidas', 
  'Limpeza',
  'Higiene',
  'Eletronicos',
  'Outros'
];
```

### Configurar Limite de Estoque Baixo
Modifique a condição em vários arquivos (padrão: <= 10 unidades):
```javascript
produto.estoque <= 10
```

### Alterar Porta da API
Edite `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3001';
```

## 🎨 Design

O sistema utiliza um design clean e responsivo com:
- Sidebar de navegação com ícones
- Cards informativos no dashboard
- Tabelas responsivas para listagens
- Modais para formulários
- Alertas visuais para estoque baixo
- Paleta de cores profissional

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (layout completo com sidebar)
- Tablet (adaptação de grid e tabelas)
- Mobile (navegação otimizada)

## 🔒 Segurança

- Validações no frontend para dados de entrada
- Códigos de produto com padrão específico
- Verificações de estoque antes das vendas
- Confirmações para ações destrutivas

## 🚀 Próximas Funcionalidades

- Sistema de backup automático
- Impressão de relatórios
- Códigos de barras
- Múltiplos usuários com permissões
- Integração com impressoras fiscais
- App mobile

## 🌐 Versão Online

Em produção, o sistema funciona com:
- **Frontend**: Totalmente funcional
- **API Mock**: Dados salvos no localStorage do navegador
- **Dados de exemplo**: Produtos e vendas pré-cadastrados
- **Funcionalidades completas**: Todas as features funcionando

> **Nota**: Para uso comercial, implemente um backend real com banco de dados.

## 📞 Suporte

Este é um sistema para testes locais. Para uso em produção, considere implementar:
- Banco de dados real (PostgreSQL, MySQL)
- Autenticação e autorização
- Backup automático
- Logs de auditoria
- SSL/HTTPS

---

**Desenvolvido com ❤️ para facilitar a gestão do seu armazém!**
