const { Pool } = require('pg');

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'licitacoes',
  password: '5483', // Substitua pela senha que você definiu
  port: 5432,
});

// Teste de conexão
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err);
  } else {
    console.log('Conectado ao PostgreSQL:', res.rows[0].now);
  }
});

// Função para criar o banco de dados e tabelas
async function inicializarBancoDados() {
  const client = await pool.connect();
  
  try {
    // Inicia uma transação
    await client.query('BEGIN');
    
    // Tabela de Licitantes
    await client.query(`
      CREATE TABLE IF NOT EXISTS licitantes (
        id SERIAL PRIMARY KEY,
        razao_social VARCHAR(255) NOT NULL,
        cnpj VARCHAR(20) NOT NULL,
        telefone VARCHAR(20),
        telefone2 VARCHAR(20),
        celular VARCHAR(20),
        endereco VARCHAR(255),
        cidade VARCHAR(100),
        estado VARCHAR(2),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Tabela de Sócios
    await client.query(`
      CREATE TABLE IF NOT EXISTS socios (
        id SERIAL PRIMARY KEY,
        licitante_id INTEGER REFERENCES licitantes(id) ON DELETE CASCADE,
        nome VARCHAR(255),
        cpf VARCHAR(20)
      )
    `);
    
    // Tabela de Modalidades
    await client.query(`
      CREATE TABLE IF NOT EXISTS modalidades (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL
      )
    `);
    
    // Verifica se a tabela de modalidades está vazia
    const modalidadesResult = await client.query('SELECT COUNT(*) FROM modalidades');
    if (parseInt(modalidadesResult.rows[0].count) === 0) {
      // Insere as modalidades padrão
      const modalidades = [
        'Concorrência', 'LRE Presencial', 'LRE Eletrônico', 'Concurso',
        'Leilão', 'Pregão presencial', 'Pregão eletrônico', 'Dispensa de Licitação',
        'Inexigibilidade', 'Cotação Eletrônica', 'Tomada de Preços'
      ];
      
      for (const modalidade of modalidades) {
        await client.query('INSERT INTO modalidades (nome) VALUES ($1)', [modalidade]);
      }
    }
    
    // Tabela de Tipos de Licitação
    await client.query(`
      CREATE TABLE IF NOT EXISTS tipos_licitacao (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL
      )
    `);
    
    // Verifica se a tabela de tipos está vazia
    const tiposResult = await client.query('SELECT COUNT(*) FROM tipos_licitacao');
    if (parseInt(tiposResult.rows[0].count) === 0) {
      // Insere os tipos padrão
      const tipos = [
        'Menor preço', 'Melhor técnica', 'Técnica e preço',
        'Maior lance ou oferta', 'Maior Desconto'
      ];
      
      for (const tipo of tipos) {
        await client.query('INSERT INTO tipos_licitacao (nome) VALUES ($1)', [tipo]);
      }
    }
    
    // Finaliza a transação
    await client.query('COMMIT');
    console.log('Banco de dados inicializado com sucesso!');
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao inicializar banco de dados:', err);
  } finally {
    client.release();
  }
}

// Inicializa o banco de dados
inicializarBancoDados();

module.exports = {
  query: (text, params) => pool.query(text, params)
};