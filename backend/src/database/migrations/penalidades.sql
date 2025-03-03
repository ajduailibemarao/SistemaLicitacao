-- src/database/migrations/penalidades.sql
CREATE TABLE IF NOT EXISTS penalidades (
  id SERIAL PRIMARY KEY,
  licitante_id INTEGER REFERENCES licitantes(id),
  tipo_penalidade VARCHAR(100) NOT NULL,
  motivo TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  processo_administrativo VARCHAR(100),
  observacoes TEXT,
  documento_url VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tipos de penalidades padrão
CREATE TABLE IF NOT EXISTS tipos_penalidade (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

-- Inserir tipos de penalidades padrão se a tabela estiver vazia
INSERT INTO tipos_penalidade (nome)
SELECT tipo FROM (
  VALUES 
    ('Advertência'),
    ('Multa'),
    ('Suspensão temporária'),
    ('Impedimento de licitar'),
    ('Declaração de inidoneidade')
) AS t(tipo)
WHERE NOT EXISTS (SELECT 1 FROM tipos_penalidade);