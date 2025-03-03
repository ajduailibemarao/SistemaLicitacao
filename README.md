Sistema de Controle de Licitações - Documentação
Este documento fornece uma visão detalhada do sistema de controle de licitações desenvolvido, incluindo sua arquitetura, módulos implementados, e instruções para instalação e uso.

Índice
Visão Geral
Arquitetura do Sistema
Módulos Implementados
Tecnologias Utilizadas
Instalação e Configuração
Uso do Sistema
API Endpoints
Estrutura de Diretórios
Contribuição
Visão Geral
O Sistema de Controle de Licitações é uma aplicação web desenvolvida para gerenciar processos licitatórios, permitindo o cadastro, acompanhamento e geração de relatórios de licitações, além do controle de penalidades aplicadas a empresas.

O sistema possui uma interface amigável e responsiva, desenvolvida com Vue.js no frontend e Node.js com Express no backend, utilizando PostgreSQL como banco de dados.

Arquitetura do Sistema
O sistema segue uma arquitetura cliente-servidor:

Frontend: Aplicação SPA (Single Page Application) desenvolvida com Vue.js
Backend: API RESTful desenvolvida com Node.js e Express
Banco de Dados: PostgreSQL para armazenamento persistente de dados
Diagrama de Arquitetura
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│   Cliente   │────▶│   Backend   │────▶│  Banco de   │
│   (Vue.js)  │◀────│  (Node.js)  │◀────│    Dados    │
│             │     │             │     │ (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘
Módulos Implementados
1. Dashboard
O módulo de Dashboard fornece uma visão geral do sistema, exibindo estatísticas e gráficos sobre licitações e penalidades.

Funcionalidades:

Exibição de estatísticas gerais (total de licitações, licitações em andamento, etc.)
Gráficos de licitações por status
Gráficos de valores adjudicados nos últimos meses
Listagem de licitações e penalidades recentes
2. Licitantes
Módulo para gerenciamento de empresas participantes de licitações.

Funcionalidades:

Cadastro de licitantes
Listagem de licitantes
Edição de informações de licitantes
Visualização detalhada de licitantes
3. Licitações
Módulo central do sistema, responsável pelo gerenciamento de processos licitatórios.

Funcionalidades:

Cadastro de licitações
Listagem de licitações com filtros
Edição de licitações
Visualização detalhada de licitações
Acompanhamento do status de licitações
4. Penalidades
Módulo para controle de sanções aplicadas a empresas.

Funcionalidades:

Cadastro de penalidades
Listagem de penalidades
Edição de penalidades
Visualização detalhada de penalidades
Controle de vigência de penalidades
5. Relatórios
Módulo para geração de relatórios e análises.

Funcionalidades:

Relatório geral de licitações
Relatório de demandas por diretoria
Relatório detalhado de licitações
Exportação de relatórios para Excel, PDF e Word
Tecnologias Utilizadas
Frontend
Vue.js 3
Chart.js (para gráficos)
Axios (para requisições HTTP)
CSS3 com Flexbox e Grid
Backend
Node.js
Express.js
PostgreSQL (banco de dados)
ExcelJS (para exportação para Excel)
PDFKit (para exportação para PDF)
DocX (para exportação para Word)
Instalação e Configuração
Pré-requisitos
Node.js (v14 ou superior)
PostgreSQL (v12 ou superior)
npm ou yarn
Passos para Instalação
Clone o repositório:
bash
Copy Code
git clone https://github.com/ajduailibemarao/SistemaLicitacao.git
cd SistemaLicitacao
Instale as dependências do backend:
bash
Copy Code
cd backend
npm install
Instale as dependências do frontend:
bash
Copy Code
cd ../frontend
npm install
Configure o banco de dados:
Crie um banco de dados PostgreSQL
Copie o arquivo .env.example para .env e configure as variáveis de ambiente:
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
Execute os scripts de criação de tabelas:
bash
Copy Code
cd ../backend
npm run migrate
Inicie o backend:
bash
Copy Code
npm start
Inicie o frontend:
bash
Copy Code
cd ../frontend
npm run serve
Acesse o sistema:
Abra o navegador e acesse http://localhost:8080
Uso do Sistema
Dashboard
O Dashboard é a tela inicial do sistema, exibindo estatísticas e gráficos sobre licitações e penalidades. Ele fornece uma visão geral do estado atual do sistema.

Gerenciamento de Licitantes
Acesse o menu "Licitantes"
Para cadastrar um novo licitante, clique em "Cadastrar Licitante"
Para visualizar ou editar um licitante existente, clique em "Listar Licitantes"
Gerenciamento de Licitações
Acesse o menu "Licitações"
Para cadastrar uma nova licitação, clique em "Cadastrar Licitação"
Para visualizar ou editar uma licitação existente, clique em "Listar Licitações"
Utilize os filtros disponíveis para encontrar licitações específicas
Gerenciamento de Penalidades
Acesse o menu "Penalidades"
Para cadastrar uma nova penalidade, clique em "Cadastrar Penalidade"
Para visualizar ou editar uma penalidade existente, clique em "Listar Penalidades"
Geração de Relatórios
Acesse o menu "Relatórios"
Selecione o tipo de relatório desejado:
Relatório Geral
Relatório de Demandas
Relatório Detalhado
Aplique os filtros desejados
Visualize o relatório na tela ou exporte para Excel, PDF ou Word
API Endpoints
Licitantes
GET /api/licitantes - Listar todos os licitantes
GET /api/licitantes/:id - Obter detalhes de um licitante
POST /api/licitantes - Cadastrar um novo licitante
PUT /api/licitantes/:id - Atualizar um licitante
DELETE /api/licitantes/:id - Excluir um licitante
Licitações
GET /api/licitacoes - Listar todas as licitações
GET /api/licitacoes/:id - Obter detalhes de uma licitação
POST /api/licitacoes - Cadastrar uma nova licitação
PUT /api/licitacoes/:id - Atualizar uma licitação
DELETE /api/licitacoes/:id - Excluir uma licitação
Penalidades
GET /api/penalidades - Listar todas as penalidades
GET /api/penalidades/:id - Obter detalhes de uma penalidade
POST /api/penalidades - Cadastrar uma nova penalidade
PUT /api/penalidades/:id - Atualizar uma penalidade
DELETE /api/penalidades/:id - Excluir uma penalidade
Relatórios
GET /api/relatorios/geral - Obter dados para o relatório geral
GET /api/relatorios/demandas - Obter dados para o relatório de demandas
GET /api/relatorios/detalhamento - Obter dados para o relatório detalhado
Exportação
GET /api/exportacao/relatorios/geral/excel - Exportar relatório geral para Excel
GET /api/exportacao/relatorios/geral/pdf - Exportar relatório geral para PDF
GET /api/exportacao/relatorios/detalhamento/excel - Exportar relatório detalhado para Excel
GET /api/exportacao/relatorios/detalhamento/pdf - Exportar relatório detalhado para PDF
Estrutura de Diretórios
sistema-licitacao/
├── backend/
│   ├── database/
│   │   └── database.js
│   ├── routes/
│   │   ├── licitantes.js
│   │   ├── licitacoes.js
│   │   ├── penalidades.js
│   │   ├── relatorios.js
│   │   └── exportacao.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── licitantes/
│   │   │   ├── licitacoes/
│   │   │   ├── penalidades/
│   │   │   └── relatorios/
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
└── README.md
Contribuição
Para contribuir com o projeto:

Faça um fork do repositório
Crie uma branch para sua feature (git checkout -b feature/nova-feature)
Faça commit das suas alterações (git commit -m 'Adiciona nova feature')
Faça push para a branch (git push origin feature/nova-feature)
Abra um Pull Request
