const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// POST /auth/registrar
async function registrar(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send('Nome, e-mail e senha são obrigatórios.');
  }

  try {
    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(409).send('E-mail já cadastrado.');
    }

    const hash = await bcrypt.hash(senha, 10);

    await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)',
      [nome, email, hash]
    );

    return res.status(201).send('Usuário cadastrado com sucesso!');
  } catch (err) {
    console.error('Erro ao registrar:', err.message);
    return res.status(500).send('Erro interno ao registrar usuário.');
  }
}

// POST /auth/login
async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send('E-mail e senha são obrigatórios.');
  }

  try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(401).send('E-mail ou senha incorretos.');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).send('E-mail ou senha incorretos.');
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      id: usuario.id,
      nome: usuario.nome,
      token,
    });
  } catch (err) {
    console.error('Erro ao fazer login:', err.message);
    return res.status(500).send('Erro interno ao fazer login.');
  }
}

module.exports = { registrar, login };
