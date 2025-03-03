// src/routes/exportacao.js
const express = require('express');
const router = express.Router();
const db = require('../database/database');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } = require('docx');
const fs = require('fs');
const path = require('path');

// Exportar licitações para Excel
router.get('/licitacoes/excel', async (req, res) => {
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
    
    const licitacoes = result.rows;
    
    // Criar um novo workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Licitações');
    
    // Definir cabeçalhos
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Identificação', key: 'identificacao', width: 20 },
      { header: 'Data de Entrada', key: 'data_entrada', width: 15 },
      { header: 'Data da Licitação', key: 'data_licitacao', width: 15 },
      { header: 'Licitante', key: 'licitante_nome', width: 30 },
      { header: 'Modalidade', key: 'modalidade_nome', width: 20 },
      { header: 'Tipo', key: 'tipo_nome', width: 20 },
      { header: 'Objeto', key: 'objeto', width: 40 },
      { header: 'Setor', key: 'setor_nome', width: 15 },
      { header: 'Diretoria', key: 'diretoria_nome', width: 15 },
      { header: 'Valor Estimado', key: 'valor_estimado', width: 15 },
      { header: 'Valor Adjudicado', key: 'valor_adjudicacao', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];
    
    // Adicionar dados
    licitacoes.forEach(licitacao => {
      worksheet.addRow({
        id: licitacao.id,
        identificacao: licitacao.identificacao,
        data_entrada: licitacao.data_entrada ? new Date(licitacao.data_entrada).toLocaleDateString() : '',
        data_licitacao: licitacao.data_licitacao ? new Date(licitacao.data_licitacao).toLocaleDateString() : '',
        licitante_nome: licitacao.licitante_nome || '',
        modalidade_nome: licitacao.modalidade_nome || '',
        tipo_nome: licitacao.tipo_nome || '',
        objeto: licitacao.objeto || '',
        setor_nome: licitacao.setor_nome || '',
        diretoria_nome: licitacao.diretoria_nome || '',
        valor_estimado: licitacao.valor_estimado || 0,
        valor_adjudicacao: licitacao.valor_adjudicacao || 0,
        status: licitacao.status || ''
      });
    });
    
    // Estilizar cabeçalhos
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Configurar resposta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=licitacoes.xlsx');
    
    // Enviar o arquivo
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao exportar licitações para Excel' });
  }
});

// Exportar licitações para PDF
router.get('/licitacoes/pdf', async (req, res) => {
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
    
    const licitacoes = result.rows;
    
    // Criar um novo documento PDF
    const doc = new PDFDocument({ margin: 50 });
    
    // Configurar resposta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=licitacoes.pdf');
    
    // Pipe o PDF para a resposta
    doc.pipe(res);
    
    // Adicionar título
    doc.fontSize(20).text('Relatório de Licitações', { align: 'center' });
    doc.moveDown();
    
    // Adicionar data do relatório
    doc.fontSize(12).text(`Data do relatório: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();
    
    // Definir posições das colunas
    const tableTop = 150;
    const idX = 50;
    const identificacaoX = 80;
    const licitanteX = 200;
    const valorX = 350;
    const statusX = 450;
    
    // Adicionar cabeçalhos da tabela
    doc.fontSize(10).text('ID', idX, tableTop);
    doc.text('Identificação', identificacaoX, tableTop);
    doc.text('Licitante', licitanteX, tableTop);
    doc.text('Valor Est.', valorX, tableTop);
    doc.text('Status', statusX, tableTop);
    
    // Desenhar linha horizontal
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    
    // Adicionar dados
    let y = tableTop + 25;
    licitacoes.forEach((licitacao, i) => {
      // Verificar se precisa de uma nova página
      if (y > 700) {
        doc.addPage();
        y = 50;
        
        // Adicionar cabeçalhos na nova página
        doc.fontSize(10).text('ID', idX, y);
        doc.text('Identificação', identificacaoX, y);
        doc.text('Licitante', licitanteX, y);
        doc.text('Valor Est.', valorX, y);
        doc.text('Status', statusX, y);
        
        // Desenhar linha horizontal
        doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
        
        y += 25;
      }
      
      doc.fontSize(8).text(licitacao.id.toString(), idX, y);
      doc.text(licitacao.identificacao || '', identificacaoX, y);
      doc.text(licitacao.licitante_nome || '', licitanteX, y);
      doc.text(licitacao.valor_estimado ? `R$ ${licitacao.valor_estimado.toFixed(2)}` : '', valorX, y);
      doc.text(licitacao.status || '', statusX, y);
      
      y += 20;
      
      // Desenhar linha horizontal leve entre as linhas
      if (i < licitacoes.length - 1) {
        doc.moveTo(50, y - 10).lineTo(550, y - 10).stroke('#dddddd');
      }
    });
    
    // Finalizar o documento
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao exportar licitações para PDF' });
  }
});

// Exportar licitações para Word
router.get('/licitacoes/word', async (req, res) => {
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
    
    const licitacoes = result.rows;
    
    // Criar um novo documento Word
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: 'Relatório de Licitações',
            heading: 'Heading1',
            alignment: 'center'
          }),
          new Paragraph({
            text: `Data do relatório: ${new Date().toLocaleDateString()}`,
            alignment: 'right'
          }),
          new Paragraph({ text: '' }),
          
          // Criar tabela
          new Table({
            rows: [
              // Cabeçalho
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('ID')] }),
                  new TableCell({ children: [new Paragraph('Identificação')] }),
                  new TableCell({ children: [new Paragraph('Licitante')] }),
                  new TableCell({ children: [new Paragraph('Modalidade')] }),
                  new TableCell({ children: [new Paragraph('Valor Estimado')] }),
                  new TableCell({ children: [new Paragraph('Status')] })
                ]
              }),
              
              // Dados
              ...licitacoes.map(licitacao => 
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(licitacao.id.toString())] }),
                    new TableCell({ children: [new Paragraph(licitacao.identificacao || '')] }),
                    new TableCell({ children: [new Paragraph(licitacao.licitante_nome || '')] }),
                    new TableCell({ children: [new Paragraph(licitacao.modalidade_nome || '')] }),
                    new TableCell({ children: [new Paragraph(licitacao.valor_estimado ? `R$ ${licitacao.valor_estimado.toFixed(2)}` : '')] }),
                    new TableCell({ children: [new Paragraph(licitacao.status || '')] })
                  ]
                })
              )
            ]
          })
        ]
      }]
    });
    
    // Gerar o arquivo
    const buffer = await Packer.toBuffer(doc);
    
    // Configurar resposta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=licitacoes.docx');
    
    // Enviar o arquivo
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao exportar licitações para Word' });
  }
});

module.exports = router;