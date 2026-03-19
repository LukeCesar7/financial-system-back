require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const transacoesRoutes = require('./routes/transacoes');

const app = express();

// Libera o front rodando em outro localhost
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/transacoes', transacoesRoutes);

// Health check
app.get('/', (req, res) => {
  res.send(' Backend rodando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n Servidor rodando em http://localhost:${PORT}`);
  console.log(` Rotas disponíveis:`);
  console.log(`   POST   /auth/registrar`);
  console.log(`   POST   /auth/login`);
  console.log(`   GET    /transacoes/usuario/:id`);
  console.log(`   POST   /transacoes/usuario/:id`);
  console.log(`   PUT    /transacoes/:id`);
  console.log(`   DELETE /transacoes/:id\n`);
});
