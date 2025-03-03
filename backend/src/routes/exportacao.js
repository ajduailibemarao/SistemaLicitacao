// src/routes/exportacao.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const path = require('path');

// Exportar relatório geral para Excel
router.get('/relatorios/geral/excel', async (req, res) => {
  try {
    const { ano, mes } = req.query;
    
    // Obter dados do relatório
    let query = `
      SELECT 
        EXTRACT(YEAR FROM data_entrada) AS ano,
        EXTRACT(MONTH FROM data_entrada) AS mes,
        COUNT(*) AS total_licitacoes,
        SUM(CASE WHEN status = 'Adjudicada' THEN 1 ELSE 0 END) AS adjudicadas,
        SUM(CASE WHEN status = 'Em andamento' THEN 1 ELSE 0 END) AS em_andamento,
        SUM(CASE WHEN status NOT IN ('Adjudicada', 'Em andamento') THEN 1 ELSE 0 END) AS outras,
        SUM(valor_estimado) AS valor_estimado_total,
        SUM(CASE WHEN status = 'Adjudicada' THEN valor_adjudicado ELSE 0 END) AS valor_adjudicado_total
      FROM licitacoes
      WHERE 1=1
    `;
    
    const params = [];
    
    if (ano) {
      query += ` AND EXTRACT(YEAR FROM data_entrada) = $${params.length + 1}`;
      params.push(ano);
    }
    
    if (mes) {
      query += ` AND EXTRACT(MONTH FROM data_entrada) = $${params.length + 1}`;
      params.push(mes);
    }
    
    query += `
      GROUP BY ano, mes
      ORDER BY ano DESC, mes DESC
    `;
    
    const result = await db.query(query, params);
    const dados = result.rows;
    
    // Criar workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório Geral');
    
    // Adicionar cabeçalho
    worksheet.columns = [
      { header: 'Período', key: 'periodo', width: 15 },
      { header: 'Total de Licitações', key: 'total_licitacoes', width: 20 },
      { header: 'Adjudicadas', key: 'adjudicadas', width: 15 },
      { header: 'Em Andamento', key: 'em_andamento', width: 15 },
      { header: 'Outras Situações', key: 'outras', width: 15 },
      { header: 'Valor Estimado', key: 'valor_estimado_total', width: 20 },
      { header: 'Valor Adjudicado', key: 'valor_adjudicado_total', width: 20 }
    ];
    
    // Formatar mês como nome
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    // Adicionar dados
    dados.forEach(item => {
      worksheet.addRow({
        periodo: `${meses[parseInt(item.mes) - 1]}/${item.ano}`,
        total_licitacoes: item.total_licitacoes,
        adjudicadas: item.adjudicadas,
        em_andamento: item.em_andamento,
        outras: item.outras,
        valor_estimado_total: item.valor_estimado_total,
        valor_adjudicado_total: item.valor_adjudicado_total
      });
    });
    
    // Formatar células de valores como moeda
    worksheet.getColumn('valor_estimado_total').numFmt = '"R$"#,##0.00';
    worksheet.getColumn('valor_adjudicado_total').numFmt = '"R$"#,##0.00';
    
    // Estilizar cabeçalho
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Configurar resposta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_geral.xlsx');
    
    // Enviar arquivo
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Erro ao exportar relatório para Excel:', error);
    res.status(500).json({ error: 'Erro ao exportar relatório para Excel' });
  }
});

// Exportar relatório geral para PDF
router.get('/relatorios/geral/pdf', async (req, res) => {
  try {
    const { ano, mes } = req.query;
    
    // Obter dados do relatório
    let query = `
      SELECT 
        EXTRACT(YEAR FROM data_entrada) AS ano,
        EXTRACT(MONTH FROM data_entrada) AS mes,
        COUNT(*) AS total_licitacoes,
        SUM(CASE WHEN status = 'Adjudicada' THEN 1 ELSE 0 END) AS adjudicadas,
        SUM(CASE WHEN status = 'Em andamento' THEN 1 ELSE 0 END) AS em_andamento,
        SUM(CASE WHEN status NOT IN ('Adjudicada', 'Em andamento') THEN 1 ELSE 0 END) AS outras,
        SUM(valor_estimado) AS valor_estimado_total,
        SUM(CASE WHEN status = 'Adjudicada' THEN valor_adjudicado ELSE 0 END) AS valor_adjudicado_total
      FROM licitacoes
      WHERE 1=1
    `;
    
    const params = [];
    
    if (ano) {
      query += ` AND EXTRACT(YEAR FROM data_entrada) = $${params.length + 1}`;
      params.push(ano);
    }
    
    if (mes) {
      query += ` AND EXTRACT(MONTH FROM data_entrada) = $${params.length + 1}`;
      params.push(mes);
    }
    
    query += `
      GROUP BY ano, mes
      ORDER BY ano DESC, mes DESC
    `;
    
    const result = await db.query(query, params);
    const dados = result.rows;
    
    // Formatar mês como nome
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    // Criar documento PDF
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    
    // Configurar resposta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_geral.pdf');
    
    // Pipe para resposta
    doc.pipe(res);
    
    // Título
    doc.fontSize(18).text('Relatório Geral de Licitações', { align: 'center' });
    doc.moveDown();
    
    // Filtros aplicados
    let filtrosTexto = 'Filtros: ';
    if (ano) filtrosTexto += `Ano: ${ano} `;
    if (mes) filtrosTexto += `Mês: ${meses[parseInt(mes) - 1]} `;
    if (filtrosTexto === 'Filtros: ') filtrosTexto += 'Nenhum';
    
    doc.fontSize(10).text(filtrosTexto);
    doc.moveDown();
    
    // Preparar dados para a tabela
    const tableData = {
      headers: ['Período', 'Total', 'Adjudicadas', 'Em Andamento', 'Outras', 'Valor Estimado', 'Valor Adjudicado'],
      rows: dados.map(item => [
        `${meses[parseInt(item.mes) - 1].substring(0, 3)}/${item.ano}`,
        item.total_licitacoes,
        item.adjudicadas,
        item.em_andamento,
        item.outras,
        `R$ ${parseFloat(item.valor_estimado_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        `R$ ${parseFloat(item.valor_adjudicado_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      ])
    };
    
    // Adicionar tabela
    await doc.table(tableData, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8),
      prepareRow: () => doc.font('Helvetica').fontSize(8)
    });
    
    // Finalizar documento
    doc.end();
  } catch (error) {
    console.error('Erro ao exportar relatório para PDF:', error);
    res.status(500).json({ error: 'Erro ao exportar relatório para PDF' });
  }
});

// Exportar relatório detalhado para Excel
router.get('/relatorios/detalhamento/excel', async (req, res) => {
  try {
    const { modalidade_id, status, data_inicio, data_fim } = req.query;
    
    // Obter dados do relatório
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
    const licitacoes = result.rows;
    
    // Criar workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório Detalhado');
    
    // Adicionar cabeçalho
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Identificação', key: 'identificacao', width: 20 },
      { header: 'Objeto', key: 'objeto', width: 40 },
      { header: 'Modalidade', key: 'modalidade_nome', width: 20 },
      { header: 'Data Entrada', key: 'data_entrada', width: 15 },
      { header: 'Licitante', key: 'licitante_nome', width: 30 },
      { header: 'Valor Estimado', key: 'valor_estimado', width: 20 },
      { header: 'Valor Adjudicado', key: 'valor_adjudicado', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ];
    
    // Adicionar dados
    licitacoes.forEach(licitacao => {
      worksheet.addRow({
        id: licitacao.id,
        identificacao: licitacao.identificacao,
        objeto: licitacao.objeto,
        modalidade_nome: licitacao.modalidade_nome,
        data_entrada: licitacao.data_entrada ? new Date(licitacao.data_entrada) : null,
        licitante_nome: licitacao.licitante_nome,
        valor_estimado: licitacao.valor_estimado,
        valor_adjudicado: licitacao.valor_adjudicado,
        status: licitacao.status
      });
    });
    
    // Formatar células de valores como moeda
    worksheet.getColumn('valor_estimado').numFmt = '"R$"#,##0.00';
    worksheet.getColumn('valor_adjudicado').numFmt = '"R$"#,##0.00';
    
    // Formatar células de data
    worksheet.getColumn('data_entrada').numFmt = 'dd/mm/yyyy';
    
    // Estilizar cabeçalho
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Configurar resposta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio_detalhado.xlsx');
    
    // Enviar arquivo
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Erro ao exportar relatório detalhado para Excel:', error);
    res.status(500).json({ error: 'Erro ao exportar relatório detalhado para Excel' });
  }
});

module.exports = router;