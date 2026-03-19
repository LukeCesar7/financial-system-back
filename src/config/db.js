const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),  // força string
  database: process.env.DB_NAME,
});

pool.on('connect', () => {
  console.log('Conectado ao Postgre');
});

pool.on('error', (err) => {
  console.error('Erro no pool do PostgreSQL:', err.message);
});

module.exports = pool;