// src/routes/licitacoes.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');

// Listar todas as licitações
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
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
      ORDER BY l.data_entrada DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar licitações' });
  }
});

// Obter uma licitação específica
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const result = await db.query(`
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
      WHERE l.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Licitação não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar licitação' });
  }
});

// Criar uma nova licitação
router.post('/', async (req, res) => {
  const {
    identificacao, 
    dataEntrada, 
    dataLicitacao, 
    horarioLicitacao,
    licitanteId, 
    modalidadeId, 
    numeroLicitacao,
    tipoId, 
    objeto, 
    setorId, 
    diretoriaId, 
    valorEstimado, 
    valorAdjudicacao,
    prazoExecucao, 
    dataAdjudicacao, 
    status
  } = req.body;
  
  if (!identificacao || !modalidadeId || !tipoId || !setorId) {
    return res.status(400).json({ 
      error: 'Identificação, modalidade, tipo e setor são obrigatórios' 
    });
  }
  
  try {
    const result = await db.query(
      `INSERT INTO licitacoes (
        identificacao, data_entrada, data_licitacao, horario_licitacao,
        licitante_id, modalidade_id, numero_licitacao, tipo_id, objeto,
        setor_id, diretoria_id, valor_estimado, valor_adjudicacao,
        prazo_execucao, data_adjudicacao, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id`,
      [
        identificacao, dataEntrada, dataLicitacao, horarioLicitacao,
        licitanteId, modalidadeId, numeroLicitacao, tipoId, objeto,
        setorId, diretoriaId, valorEstimado, valorAdjudicacao,
        prazoExecucao, dataAdjudicacao, status
      ]
    );
    
    res.status(201).json({ 
      id: result.rows[0].id,
      message: 'Licitação criada com sucesso' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar licitação' });
  }
});

// Atualizar uma licitação
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const {
    identificacao, 
    dataEntrada, 
    dataLicitacao, 
    horarioLicitacao,
    licitanteId, 
    modalidadeId, 
    numeroLicitacao,
    tipoId, 
    objeto, 
    setorId, 
    diretoriaId, 
    valorEstimado, 
    valorAdjudicacao,
    prazoExecucao, 
    dataAdjudicacao, 
    status
  } = req.body;
  
  if (!identificacao || !modalidadeId || !tipoId || !setorId) {
    return res.status(400).json({ 
      error: 'Identificação, modalidade, tipo e setor são obrigatórios' 
    });
  }
  
  try {
    const result = await db.query(
      `UPDATE licitacoes SET
        identificacao = $1, 
        data_entrada = $2, 
        data_licitacao = $3, 
        horario_licitacao = $4,
        licitante_id = $5, 
        modalidade_id = $6, 
        numero_licitacao = $7,
        tipo_id = $8, 
        objeto = $9, 
        setor_id = $10, 
        diretoria_id = $11, 
        valor_estimado = $12, 
        valor_adjudicacao = $13,
        prazo_execucao = $14, 
        data_adjudicacao = $15, 
        status = $16
      WHERE id = $17
      RETURNING id`,
      [
        identificacao, dataEntrada, dataLicitacao, horarioLicitacao,
        licitanteId, modalidadeId, numeroLicitacao, tipoId, objeto,
        setorId, diretoriaId, valorEstimado, valorAdjudicacao,
        prazoExecucao, dataAdjudicacao, status, id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Licitação não encontrada' });
    }
    
    res.json({ message: 'Licitação atualizada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar licitação' });
  }
});

// Excluir uma licitação
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const result = await db.query(
      'DELETE FROM licitacoes WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Licitação não encontrada' });
    }
    
    res.json({ message: 'Licitação excluída com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir licitação' });
  }
});

module.exports = router;