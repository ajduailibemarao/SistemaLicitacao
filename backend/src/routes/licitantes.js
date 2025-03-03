const express = require('express');
const router = express.Router();
const db = require('../database/database');

// Listar todos os licitantes
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM licitantes ORDER BY razao_social'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar licitantes' });
  }
});

// Obter um licitante específico com seus sócios
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    // Busca o licitante
    const licitanteResult = await db.query(
      'SELECT * FROM licitantes WHERE id = $1',
      [id]
    );
    
    if (licitanteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Licitante não encontrado' });
    }
    
    const licitante = licitanteResult.rows[0];
    
    // Busca os sócios deste licitante
    const sociosResult = await db.query(
      'SELECT * FROM socios WHERE licitante_id = $1',
      [id]
    );
    
    // Adiciona os sócios ao objeto do licitante
    licitante.socios = sociosResult.rows;
    
    res.json(licitante);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar licitante' });
  }
});

// Criar um novo licitante
router.post('/', async (req, res) => {
  const {
    razaoSocial, cnpj, telefone, telefone2, celular,
    endereco, cidade, estado, email, socios
  } = req.body;
  
  if (!razaoSocial || !cnpj) {
    return res.status(400).json({ error: 'Razão Social e CNPJ são obrigatórios' });
  }
  
  try {
    // Inicia uma transação
    await db.query('BEGIN');
    
    // Insere o licitante
    const licitanteResult = await db.query(
      `INSERT INTO licitantes 
      (razao_social, cnpj, telefone, telefone2, celular, endereco, cidade, estado, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`,
      [razaoSocial, cnpj, telefone, telefone2, celular, endereco, cidade, estado, email]
    );
    
    const licitanteId = licitanteResult.rows[0].id;
    
    // Se houver sócios, insere cada um deles
    if (socios && socios.length > 0) {
      for (const socio of socios) {
        if (socio.nome || socio.cpf) { // Só insere se tiver pelo menos um dos campos
          await db.query(
            'INSERT INTO socios (licitante_id, nome, cpf) VALUES ($1, $2, $3)',
            [licitanteId, socio.nome, socio.cpf]
          );
        }
      }
    }
    
    await db.query('COMMIT');
    
    res.status(201).json({
      id: licitanteId,
      message: 'Licitante cadastrado com sucesso'
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar licitante' });
  }
});

// Atualizar um licitante
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const {
    razaoSocial, cnpj, telefone, telefone2, celular,
    endereco, cidade, estado, email, socios
  } = req.body;
  
  if (!razaoSocial || !cnpj) {
    return res.status(400).json({ error: 'Razão Social e CNPJ são obrigatórios' });
  }
  
  try {
    // Inicia uma transação
    await db.query('BEGIN');
    
    // Atualiza o licitante
    const updateResult = await db.query(
      `UPDATE licitantes
      SET razao_social = $1, cnpj = $2, telefone = $3, telefone2 = $4, celular = $5,
      endereco = $6, cidade = $7, estado = $8, email = $9
      WHERE id = $10
      RETURNING id`,
      [razaoSocial, cnpj, telefone, telefone2, celular, endereco, cidade, estado, email, id]
    );
    
    if (updateResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Licitante não encontrado' });
    }
    
    // Remove todos os sócios existentes para inserir os novos
    await db.query('DELETE FROM socios WHERE licitante_id = $1', [id]);
    
    // Se houver sócios, insere cada um deles
    if (socios && socios.length > 0) {
      for (const socio of socios) {
        if (socio.nome || socio.cpf) { // Só insere se tiver pelo menos um dos campos
          await db.query(
            'INSERT INTO socios (licitante_id, nome, cpf) VALUES ($1, $2, $3)',
            [id, socio.nome, socio.cpf]
          );
        }
      }
    }
    
    await db.query('COMMIT');
    
    res.json({ message: 'Licitante atualizado com sucesso' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar licitante' });
  }
});

// Excluir um licitante
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    // Inicia uma transação
    await db.query('BEGIN');
    
    // Exclui os sócios (a restrição ON DELETE CASCADE faria isso automaticamente,
    // mas vamos fazer explicitamente para garantir)
    await db.query('DELETE FROM socios WHERE licitante_id = $1', [id]);
    
    // Exclui o licitante
    const deleteResult = await db.query(
      'DELETE FROM licitantes WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (deleteResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Licitante não encontrado' });
    }
    
    await db.query('COMMIT');
    
    res.json({ message: 'Licitante excluído com sucesso' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao excluir licitante' });
  }
});

module.exports = router;