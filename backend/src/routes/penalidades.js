// src/routes/penalidades.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');

// Listar todas as penalidades
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, 
        l.razao_social as licitante_nome,
        l.cnpj as licitante_cnpj,
        tp.nome as tipo_nome
      FROM penalidades p
      LEFT JOIN licitantes l ON p.licitante_id = l.id
      LEFT JOIN tipos_penalidade tp ON p.tipo_penalidade = tp.id
      ORDER BY p.data_inicio DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar penalidades' });
  }
});

// Obter uma penalidade específica
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const result = await db.query(`
      SELECT p.*, 
        l.razao_social as licitante_nome,
        l.cnpj as licitante_cnpj,
        tp.nome as tipo_nome
      FROM penalidades p
      LEFT JOIN licitantes l ON p.licitante_id = l.id
      LEFT JOIN tipos_penalidade tp ON p.tipo_penalidade = tp.id
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Penalidade não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar penalidade' });
  }
});

// Criar uma nova penalidade
router.post('/', async (req, res) => {
  const {
    licitante_id,
    tipo_penalidade,
    motivo,
    data_inicio,
    data_fim,
    processo_administrativo,
    observacoes,
    documento_url
  } = req.body;
  
  try {
    const result = await db.query(`
      INSERT INTO penalidades (
        licitante_id,
        tipo_penalidade,
        motivo,
        data_inicio,
        data_fim,
        processo_administrativo,
        observacoes,
        documento_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      licitante_id,
      tipo_penalidade,
      motivo,
      data_inicio,
      data_fim,
      processo_administrativo,
      observacoes,
      documento_url
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar penalidade' });
  }
});

// Atualizar uma penalidade
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const {
    licitante_id,
    tipo_penalidade,
    motivo,
    data_inicio,
    data_fim,
    processo_administrativo,
    observacoes,
    documento_url
  } = req.body;
  
  try {
    const result = await db.query(`
      UPDATE penalidades
      SET licitante_id = $1,
          tipo_penalidade = $2,
          motivo = $3,
          data_inicio = $4,
          data_fim = $5,
          processo_administrativo = $6,
          observacoes = $7,
          documento_url = $8,
          atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [
      licitante_id,
      tipo_penalidade,
      motivo,
      data_inicio,
      data_fim,
      processo_administrativo,
      observacoes,
      documento_url,
      id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Penalidade não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar penalidade' });
  }
});

// Excluir uma penalidade
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const result = await db.query('DELETE FROM penalidades WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Penalidade não encontrada' });
    }
    
    res.json({ message: 'Penalidade excluída com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir penalidade' });
  }
});

// Listar tipos de penalidades
router.get('/tipos/listar', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tipos_penalidade ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tipos de penalidades' });
  }
});

module.exports = router;