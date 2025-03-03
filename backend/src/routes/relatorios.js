// src/routes/relatorios.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');

// Relatório Geral (por ano/mês)
router.get('/geral', async (req, res) => {
  const { ano, mes } = req.query;
  
  try {
    let query = `
      SELECT 
        EXTRACT(YEAR FROM l.data_entrada) as ano,
        EXTRACT(MONTH FROM l.data_entrada) as mes,
        COUNT(*) as total_licitacoes,
        SUM(CASE WHEN l.status = 'Adjudicada' THEN 1 ELSE 0 END) as adjudicadas,
        SUM(CASE WHEN l.status = 'Em andamento' THEN 1 ELSE 0 END) as em_andamento,
        SUM(CASE WHEN l.status IN ('Suspensa', 'Revogada', 'Anulada', 'Fracassada', 'Deserta') THEN 1 ELSE 0 END) as outras,
        SUM(l.valor_estimado) as valor_estimado_total,
        SUM(l.valor_adjudicado) as valor_adjudicado_total
      FROM licitacoes l
    `;
    
    const params = [];
    let whereClause = '';
    
    if (ano) {
      whereClause += 'EXTRACT(YEAR FROM l.data_entrada) = $1';
      params.push(ano);
    }
    
    if (mes) {
      if (whereClause) {
        whereClause += ' AND ';
        params.push(mes);
        whereClause += `EXTRACT(MONTH FROM l.data_entrada) = $${params.length}`;
      } else {
        whereClause += 'EXTRACT(MONTH FROM l.data_entrada) = $1';
        params.push(mes);
      }
    }
    
    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }
    
    query += `
      GROUP BY 
        EXTRACT(YEAR FROM l.data_entrada),
        EXTRACT(MONTH FROM l.data_entrada)
      ORDER BY 
        ano DESC, 
        mes DESC
    `;
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório geral' });
  }
});

// Relatório de Demandas (por diretoria)
router.get('/demandas', async (req, res) => {
  const { ano } = req.query;
  
  try {
    let query = `
      SELECT 
        d.nome as diretoria,
        COUNT(*) as total_licitacoes,
        SUM(CASE WHEN l.status = 'Adjudicada' THEN 1 ELSE 0 END) as adjudicadas,
        SUM(CASE WHEN l.status = 'Em andamento' THEN 1 ELSE 0 END) as em_andamento,
        SUM(l.valor_estimado) as valor_estimado_total,
        SUM(l.valor_adjudicado) as valor_adjudicado_total
      FROM licitacoes l
      JOIN diretorias d ON l.diretoria_id = d.id
    `;
    
    const params = [];
    if (ano) {
      query += ' WHERE EXTRACT(YEAR FROM l.data_entrada) = $1';
      params.push(ano);
    }
    
    query += `
      GROUP BY d.nome
      ORDER BY total_licitacoes DESC
    `;
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório de demandas' });
  }
});

// Relatório de Detalhamento (por tipo/modalidade)
router.get('/detalhamento', async (req, res) => {
  const { ano, tipo } = req.query;
  
  try {
    let baseQuery = '';
    if (tipo === 'modalidade') {
      baseQuery = `
        SELECT 
          m.nome as categoria,
          COUNT(*) as total_licitacoes,
          SUM(CASE WHEN l.status = 'Adjudicada' THEN 1 ELSE 0 END) as adjudicadas,
          SUM(l.valor_estimado) as valor_estimado_total,
          SUM(l.valor_adjudicado) as valor_adjudicado_total
        FROM licitacoes l
        JOIN modalidades m ON l.modalidade_id = m.id
      `;
    } else {
      baseQuery = `
        SELECT 
          t.nome as categoria,
          COUNT(*) as total_licitacoes,
          SUM(CASE WHEN l.status = 'Adjudicada' THEN 1 ELSE 0 END) as adjudicadas,
          SUM(l.valor_estimado) as valor_estimado_total,
          SUM(l.valor_adjudicado) as valor_adjudicado_total
        FROM licitacoes l
        JOIN tipos_licitacao t ON l.tipo_id = t.id
      `;
    }
    
    const params = [];
    if (ano) {
      baseQuery += ' WHERE EXTRACT(YEAR FROM l.data_entrada) = $1';
      params.push(ano);
    }
    
    baseQuery += `
      GROUP BY categoria
      ORDER BY total_licitacoes DESC
    `;
    
    const result = await db.query(baseQuery, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório de detalhamento' });
  }
});

// Relatório de Status das Licitações
router.get('/status', async (req, res) => {
  const { ano } = req.query;
  
  try {
    let query = `
      SELECT 
        l.status,
        COUNT(*) as total,
        SUM(l.valor_estimado) as valor_estimado_total,
        SUM(l.valor_adjudicado) as valor_adjudicado_total
      FROM licitacoes l
    `;
    
    const params = [];
    if (ano) {
      query += ' WHERE EXTRACT(YEAR FROM l.data_entrada) = $1';
      params.push(ano);
    }
    
    query += `
      GROUP BY l.status
      ORDER BY total DESC
    `;
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório de status' });
  }
});

module.exports = router;