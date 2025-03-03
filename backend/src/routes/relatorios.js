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

// Relatório de Detalhamento (filtros avançados)
router.get('/detalhamento', async (req, res) => {
  const { modalidade_id, status, data_inicio, data_fim } = req.query;
  
  try {
    let query = `
      SELECT 
        l.id,
        l.identificacao,
        l.objeto,
        l.modalidade_id,
        m.nome AS modalidade_nome,
        l.data_entrada,
        l.licitante_id,
        li.razao_social AS licitante_nome,
        l.valor_estimado,
        l.valor_adjudicado,
        l.status
      FROM licitacoes l
      LEFT JOIN modalidades m ON l.modalidade_id = m.id
      LEFT JOIN licitantes li ON l.licitante_id = li.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (modalidade_id) {
      query += ` AND l.modalidade_id = $${params.length + 1}`;
      params.push(modalidade_id);
    }
    
    if (status) {
      query += ` AND l.status = $${params.length + 1}`;
      params.push(status);
    }
    
    if (data_inicio) {
      query += ` AND l.data_entrada >= $${params.length + 1}`;
      params.push(data_inicio);
    }
    
    if (data_fim) {
      query += ` AND l.data_entrada <= $${params.length + 1}`;
      params.push(data_fim);
    }
    
    query += ` ORDER BY l.data_entrada DESC`;
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório detalhado' });
  }
});

// Obter anos disponíveis para filtro
router.get('/anos', async (req, res) => {
  try {
    const query = `
      SELECT DISTINCT EXTRACT(YEAR FROM data_entrada) AS ano
      FROM licitacoes
      ORDER BY ano DESC
    `;
    
    const result = await db.query(query);
    const anos = result.rows.map(row => parseInt(row.ano));
    
    res.json(anos);
  } catch (error) {
    console.error('Erro ao obter anos disponíveis:', error);
    res.status(500).json({ error: 'Erro ao obter anos disponíveis' });
  }
});

module.exports = router;