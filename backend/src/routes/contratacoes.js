// src/routes/contratacoes.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');

// Listar todas as contratações diretas
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
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
      ORDER BY c.data_entrada DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar contratações diretas' });
  }
});

// Obter uma contratação direta específica
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const result = await db.query(`
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
      WHERE c.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contratação direta não encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar contratação direta' });
  }
});

// Criar uma nova contratação direta
router.post('/', async (req, res) => {
  const {
    identificacaoDispensa, dataEntrada, dataCotacao, horarioCotacao,
    licitanteId, modalidadeId, numeroParecer, tipoId, objeto,
    setorId, diretoriaId, processo, relator, valorEstimado,
    valorAdjudicado, dataAdjudicacao, prazoExecucao, status, motivo
  } = req.body;
  
  if (!identificacaoDispensa) {
    return res.status(400).json({ error: 'Identificação da dispensa é obrigatória' });
  }
  
  try {
    await db.query('BEGIN');
    
    const result = await db.query(`
      INSERT INTO contratacoes_diretas (
        identificacao_dispensa, data_entrada, data_cotacao, horario_cotacao,
        licitante_id, modalidade_id, numero_parecer, tipo_id, objeto,
        setor_id, diretoria_id, processo, relator, valor_estimado,
        valor_adjudicado, data_adjudicacao, prazo_execucao, status, motivo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING id
    `, [
      identificacaoDispensa, dataEntrada, dataCotacao, horarioCotacao,
      licitanteId, modalidadeId, numeroParecer, tipoId, objeto,
      setorId, diretoriaId, processo, relator, valorEstimado,
      valorAdjudicado, dataAdjudicacao, prazoExecucao, status, motivo
    ]);
    
    await db.query('COMMIT');
    
    res.status(201).json({
      id: result.rows[0].id,
      message: 'Contratação direta cadastrada com sucesso'
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar contratação direta' });
  }
});

// Atualizar uma contratação direta
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const {
    identificacaoDispensa, dataEntrada, dataCotacao, horarioCotacao,
    licitanteId, modalidadeId, numeroParecer, tipoId, objeto,
    setorId, diretoriaId, processo, relator, valorEstimado,
    valorAdjudicado, dataAdjudicacao, prazoExecucao, status, motivo
  } = req.body;
  
  if (!identificacaoDispensa) {
    return res.status(400).json({ error: 'Identificação da dispensa é obrigatória' });
  }
  
  try {
    await db.query('BEGIN');
    
    const result = await db.query(`
      UPDATE contratacoes_diretas SET
        identificacao_dispensa = $1, data_entrada = $2, data_cotacao = $3, 
        horario_cotacao = $4, licitante_id = $5, modalidade_id = $6, 
        numero_parecer = $7, tipo_id = $8, objeto = $9, setor_id = $10, 
        diretoria_id = $11, processo = $12, relator = $13, valor_estimado = $14, 
        valor_adjudicado = $15, data_adjudicacao = $16, prazo_execucao = $17, 
        status = $18, motivo = $19
      WHERE id = $20
      RETURNING id
    `, [
      identificacaoDispensa, dataEntrada, dataCotacao, horarioCotacao,
      licitanteId, modalidadeId, numeroParecer, tipoId, objeto,
      setorId, diretoriaId, processo, relator, valorEstimado,
      valorAdjudicado, dataAdjudicacao, prazoExecucao, status, motivo, id
    ]);
    
    if (result.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Contratação direta não encontrada' });
    }
    
    await db.query('COMMIT');
    
    res.json({ message: 'Contratação direta atualizada com sucesso' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar contratação direta' });
  }
});

// Excluir uma contratação direta
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    await db.query('BEGIN');
    
    const result = await db.query(
      'DELETE FROM contratacoes_diretas WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Contratação direta não encontrada' });
    }
    
    await db.query('COMMIT');
    
    res.json({ message: 'Contratação direta excluída com sucesso' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir contratação direta' });
  }
});

module.exports = router;