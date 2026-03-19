const express = require('express');
const router = express.Router();
const autenticar = require('../middleware/autenticar');
const {
  listarPorUsuario,
  criar,
  atualizar,
  excluir,
} = require('../controllers/transacoesController');

// Todas as rotas de transações exigem autenticação
router.use(autenticar);

router.get('/usuario/:id', listarPorUsuario);
router.post('/usuario/:id', criar);
router.put('/:id', atualizar);
router.delete('/:id', excluir);

module.exports = router;
