
-- Script do banco de dados Postgres

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id       SERIAL PRIMARY KEY,
  nome     VARCHAR(100)        NOT NULL,
  email    VARCHAR(150) UNIQUE NOT NULL,
  senha    VARCHAR(255)        NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transacoes (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  descricao   VARCHAR(255) NOT NULL,
  valor       NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
  tipo        VARCHAR(10)  NOT NULL CHECK (tipo IN ('RECEITA', 'DESPESA')),
  categoria   VARCHAR(100) NOT NULL,
  data        DATE         NOT NULL,
  criado_em   TIMESTAMP DEFAULT NOW()
);

-- Índice para acelear a busca de usuários 
CREATE INDEX IF NOT EXISTS idx_transacoes_usuario ON transacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_data    ON transacoes(data);
