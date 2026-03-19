const pool = require('../config/db');

// GET /transacoes/usuario/:id
async function listarPorUsuario(req, res) {
  const { id } = req.params;

  // Garante que o usuário logado só acessa os próprios dados
  if (parseInt(id) !== req.usuario.id) {
    return res.status(403).send('Acesso negado.');
  }

  try {
    const resultado = await pool.query(
      `SELECT id, descricao, valor::numeric AS valor, tipo, categoria, 
       TO_CHAR(data, 'YYYY-MM-DD') AS data
       FROM transacoes
       WHERE usuario_id = $1
       ORDER BY data DESC, id DESC`,
      [id]
    );
    return res.json(resultado.rows);
  } catch (err) {
    console.error('Erro ao listar transações:', err.message);
    return res.status(500).send('Erro ao buscar transações.');
  }
}

// POST /transacoes/usuario/:id
async function criar(req, res) {
  const { id } = req.params;
  const { descricao, valor, tipo, categoria, data } = req.body;

  if (parseInt(id) !== req.usuario.id) {
    return res.status(403).send('Acesso negado.');
  }

  if (!descricao || !valor || !tipo || !categoria || !data) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  if (!['RECEITA', 'DESPESA'].includes(tipo)) {
    return res.status(400).send('Tipo inválido. Use RECEITA ou DESPESA.');
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO transacoes (usuario_id, descricao, valor, tipo, categoria, data)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, descricao, valor::numeric AS valor, tipo, categoria, TO_CHAR(data, 'YYYY-MM-DD') AS data`,
      [id, descricao, valor, tipo, categoria, data]
    );
    return res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao criar transação:', err.message);
    return res.status(500).send('Erro ao salvar transação.');
  }
}

// PUT /transacoes/:id
async function atualizar(req, res) {
  const { id } = req.params;
  const { descricao, valor, tipo, categoria, data } = req.body;

  if (!descricao || !valor || !tipo || !categoria || !data) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  if (!['RECEITA', 'DESPESA'].includes(tipo)) {
    return res.status(400).send('Tipo inválido. Use RECEITA ou DESPESA.');
  }

  try {
    // Verifica se a transação pertence ao usuário logado
    const verificacao = await pool.query(
      'SELECT usuario_id FROM transacoes WHERE id = $1',
      [id]
    );

    if (verificacao.rows.length === 0) {
      return res.status(404).send('Transação não encontrada.');
    }

    if (verificacao.rows[0].usuario_id !== req.usuario.id) {
      return res.status(403).send('Acesso negado.');
    }

    const resultado = await pool.query(
      `UPDATE transacoes
       SET descricao = $1, valor = $2, tipo = $3, categoria = $4, data = $5
       WHERE id = $6
       RETURNING id, descricao, valor::numeric AS valor, tipo, categoria, TO_CHAR(data, 'YYYY-MM-DD') AS data`,
      [descricao, valor, tipo, categoria, data, id]
    );

    return res.json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar transação:', err.message);
    return res.status(500).send('Erro ao atualizar transação.');
  }
}

// DELETE /transacoes/:id
async function excluir(req, res) {
  const { id } = req.params;

  try {
    const verificacao = await pool.query(
      'SELECT usuario_id FROM transacoes WHERE id = $1',
      [id]
    );

    if (verificacao.rows.length === 0) {
      return res.status(404).send('Transação não encontrada.');
    }

    if (verificacao.rows[0].usuario_id !== req.usuario.id) {
      return res.status(403).send('Acesso negado.');
    }

    await pool.query('DELETE FROM transacoes WHERE id = $1', [id]);
    return res.status(204).send();
  } catch (err) {
    console.error('Erro ao excluir transação:', err.message);
    return res.status(500).send('Erro ao excluir transação.');
  }
}

module.exports = { listarPorUsuario, criar, atualizar, excluir };
