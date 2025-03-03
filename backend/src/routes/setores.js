// src/routes/setores.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');

// Listar todos os setores
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM setores ORDER BY nome');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar setores' });
  }
});

module.exports = router;