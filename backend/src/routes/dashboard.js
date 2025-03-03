// src/routes/dashboard.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');

// Rota para obter estatísticas gerais
router.get('/stats', async (req, res) => {
  try {
    // Iniciar uma transação
    const client = await db.query('BEGIN');
    
    // Total de licitações
    const totalLicitacoesResult = await db.query('SELECT COUNT(*) FROM licitacoes');
    const totalLicitacoes = parseInt(totalLicitacoesResult.rows[0].count);
    
    // Licitações em andamento
    const licitacoesEmAndamentoResult = await db.query(
      "SELECT COUNT(*) FROM licitacoes WHERE status IN ('Em Análise', 'Aprovada')"
    );
    const licitacoesEmAndamento = parseInt(licitacoesEmAndamentoResult.rows[0].count);
    
    // Licitações concluídas
    const licitacoesConcluidasResult = await db.query(
      "SELECT COUNT(*) FROM licitacoes WHERE status = 'Concluída'"
    );
    const licitacoesConcluidas = parseInt(licitacoesConcluidasResult.rows[0].count);
    
    // Total de contratações diretas
    const totalContratacoesResult = await db.query('SELECT COUNT(*) FROM contratacoes_diretas');
    const totalContratacoes = parseInt(totalContratacoesResult.rows[0].count);
    
    // Contratações em andamento
    const contratacoesEmAndamentoResult = await db.query(
      "SELECT COUNT(*) FROM contratacoes_diretas WHERE status IN ('Em Análise', 'Aprovada')"
    );
    const contratacoesEmAndamento = parseInt(contratacoesEmAndamentoResult.rows[0].count);
    
    // Contratações concluídas
    const contratacoesConcluidasResult = await db.query(
      "SELECT COUNT(*) FROM contratacoes_diretas WHERE status = 'Concluída'"
    );
    const contratacoesConcluidas = parseInt(contratacoesConcluidasResult.rows[0].count);
    
    // Total de empresas sancionadas
    const totalPenalidadesResult = await db.query('SELECT COUNT(*) FROM empresas_sancionadas');
    const totalPenalidades = parseInt(totalPenalidadesResult.rows[0].count);
    
    // Empresas com sanções vigentes
    const penalidadesVigentesResult = await db.query(
      'SELECT COUNT(*) FROM empresas_sancionadas WHERE data_termino >= CURRENT_DATE'
    );
    const penalidadesVigentes = parseInt(penalidadesVigentesResult.rows[0].count);
    
    // Licitações por status
    const licitacoesPorStatusResult = await db.query(`
      SELECT status, COUNT(*) as count
      FROM licitacoes
      GROUP BY status
    `);
    
    const licitacoesPorStatus = {};
    licitacoesPorStatusResult.rows.forEach(row => {
      licitacoesPorStatus[row.status || 'Não definido'] = parseInt(row.count);
    });
    
    // Valores adjudicados por mês (últimos 6 meses)
    const valoresPorMesResult = await db.query(`
      SELECT 
        TO_CHAR(data_adjudicacao, 'Mon') as mes,
        SUM(valor_adjudicacao) as total
      FROM licitacoes
      WHERE data_adjudicacao >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(data_adjudicacao, 'Mon'), EXTRACT(MONTH FROM data_adjudicacao)
      ORDER BY EXTRACT(MONTH FROM data_adjudicacao)
    `);
    
    const valoresPorMes = {};
    valoresPorMesResult.rows.forEach(row => {
      valoresPorMes[row.mes] = parseFloat(row.total);
    });
    
    await db.query('COMMIT');
    
    // Retornar todas as estatísticas
    res.json({
      totalLicitacoes,
      licitacoesEmAndamento,
      licitacoesConcluidas,
      totalContratacoes,
      contratacoesEmAndamento,
      contratacoesConcluidas,
      totalPenalidades,
      penalidadesVigentes,
      licitacoesPorStatus,
      valoresPorMes
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Rota para obter relatório de licitações por período
router.get('/relatorio/licitacoes', async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    
    let query = `
      SELECT l.*, 
             lic.razao_social as licitante_nome, 
             m.nome as modalidade_nome,
             t.nome as tipo_nome,
             s.nome as setor_nome,
             d.nome as diretoria_nome
      FROM licitacoes l
      LEFT JOIN licitantes lic ON l.licitante_id = lic.id
      LEFT JOIN modalidades m ON l.modalidade_id = m.id
      LEFT JOIN tipos_licitacao t ON l.tipo_id = t.id
      LEFT JOIN setores s ON l.setor_id = s.id
      LEFT JOIN diretorias d ON l.diretoria_id = d.id
    `;
    
    const params = [];
    
    if (dataInicio && dataFim) {
      query += ' WHERE l.data_entrada BETWEEN $1 AND $2';
      params.push(dataInicio, dataFim);
    }
    
    query += ' ORDER BY l.data_entrada DESC';
    
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório de licitações' });
  }
});

// Rota para obter relatório de contratações diretas por período
router.get('/relatorio/contratacoes', async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    
    let query = `
      SELECT c.*, 
             lic.razao_social as licitante_nome, 
             m.nome as modalidade_nome,
             t.nome as tipo_nome,
             s.nome as setor_nome,
             d.nome as diretoria_nome
      FROM contratacoes_diretas c
      LEFT JOIN licitantes lic ON c.licitante_id = lic.id
      LEFT JOIN modalidades m ON c.modalidade_id = m.id
      LEFT JOIN tipos_licitacao t ON c.tipo_id = t.id
      LEFT JOIN setores s ON c.setor_id = s.id
      LEFT JOIN diretorias d ON c.diretoria_id = d.id
    `;
    
    const params = [];
    
    if (dataInicio && dataFim) {
      query += ' WHERE c.data_entrada BETWEEN $1 AND $2';
      params.push(dataInicio, dataFim);
    }
    
    query += ' ORDER BY c.data_entrada DESC';
    
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório de contratações diretas' });
  }
});

// Rota para obter relatório de empresas sancionadas
router.get('/relatorio/penalidades', async (req, res) => {
  try {
    const { vigentes } = req.query;
    
    let query = `
      SELECT p.*, l.razao_social as licitante_nome, l.cnpj
      FROM empresas_sancionadas p
      LEFT JOIN licitantes l ON p.licitante_id = l.id
    `;
    
    if (vigentes === 'true') {
      query += ' WHERE p.data_termino >= CURRENT_DATE';
    }
    
    query += ' ORDER BY p.data_inicio DESC';
    
    const result = await db.query(query);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório de empresas sancionadas' });
  }
});

module.exports = router;