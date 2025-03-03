// src/routes/diretorias.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');

// Listar todas as diretorias
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM diretorias ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar diretorias' });
  }
});

module.exports = router;