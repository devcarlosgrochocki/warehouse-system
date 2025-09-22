# 🚀 Deploy Guide - Sistema de Armazém

## Deploy no Vercel (Recomendado - GRATUITO)

### 1. Criar conta no Vercel
- Acesse: https://vercel.com
- Faça login com GitHub

### 2. Deploy via GitHub
1. Crie um repositório no GitHub
2. Faça push do código:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/warehouse-system.git
   git push -u origin main
   ```
3. No Vercel, clique em "New Project"
4. Conecte seu repositório GitHub
5. Deploy automático!

### 3. Deploy Manual (Alternativa)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Outras Opções de Deploy Gratuito

### Netlify
1. Acesse: https://netlify.com
2. Arraste a pasta `dist` para o site
3. Ou conecte via GitHub

### GitHub Pages
```bash
npm install --save-dev gh-pages

# Adicionar ao package.json:
"homepage": "https://seuusuario.github.io/warehouse-system",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

## Funcionalidades em Produção

✅ **Frontend funcionando** - Interface completa
✅ **Mock API** - Dados salvos no localStorage do navegador
✅ **Dados de exemplo** - Produtos e vendas pré-cadastrados
✅ **Todas as funcionalidades** - CRUD, vendas, relatórios
✅ **Responsivo** - Funciona em mobile e desktop

## Links Úteis

- **Vercel**: https://vercel.com
- **Netlify**: https://netlify.com  
- **GitHub Pages**: https://pages.github.com

## Nota Importante

Em produção, o sistema usa localStorage para simular uma API. Os dados ficam salvos localmente no navegador de cada usuário. Para um sistema real, recomenda-se implementar um backend próprio com banco de dados.