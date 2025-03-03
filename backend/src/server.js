const express = require('express');
const cors = require('cors');
const path = require('path');

const licitantesRoutes = require ( './routes/licitantes' );
 const licitacoesRoutes = require ( './routes/licitacoes' );
 const modalidadesRoutes = require ( './routes/modalidades' );
 const tiposRoutes = require ( './routes/tipos' );
 const setoresRoutes = require ( './routes/setores' );
 const diretoriasRoutes = require ( './routes/diretorias' );
 const exportacaoRoutes = require ( './routes/exportacao' );
 const penalidadesRoutes = require('./routes/penalidades');
 const relatoriosRoutes = require('./routes/relatorios');

// Inicializar o app Express
const app = express();

// Configurações
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use('/api/licitantes', licitantesRoutes);
app.use('/api/licitacoes', licitacoesRoutes);
app.use('/api/modalidades', modalidadesRoutes);
app.use('/api/tipos', tiposRoutes);
app.use('/api/setores', setoresRoutes);
app.use('/api/diretorias', diretoriasRoutes);
app.use('/api/exportacao', exportacaoRoutes);
app.use('/api/penalidades', penalidadesRoutes);
app.use('/api/relatorios', relatoriosRoutes);

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});