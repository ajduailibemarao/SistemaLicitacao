// src/routes/tipos.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');

// Listar todos os tipos de licitação
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tipos_licitacao ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar tipos de licitação' });
  }
});

module.exports = router;