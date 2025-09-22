// Mock API for production
const MOCK_API_URL = 'https://my-json-server.typicode.com/your-username/warehouse-system';

// Detectar se está em desenvolvimento ou produção
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3002' 
  : 'https://my-json-server.typicode.com/warehouse-demo/warehouse-api';

export default API_BASE_URL;