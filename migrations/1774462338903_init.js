exports.up = (pgm) => {
  pgm.createTable('usuarios', {
    id: { type: 'serial', primaryKey: true },
    nome: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(150)', notNull: true, unique: true },
    senha: { type: 'varchar(255)', notNull: true },
    criado_em: { type: 'timestamp', default: pgm.func('NOW()') }
  });

  pgm.createTable('transacoes', {
    id: { type: 'serial', primaryKey: true },
    usuario_id: {
      type: 'integer',
      notNull: true,
      references: '"usuarios"', //Chave Estrangeira
      onDelete: 'CASCADE'
    },
    descricao: { type: 'varchar(255)', notNull: true },
    valor: { type: 'numeric(12,2)', notNull: true, check: 'valor > 0' },
    tipo: { type: 'varchar(10)', notNull: true, check: "tipo IN ('RECEITA', 'DESPESA')" },
    categoria: { type: 'varchar(100)', notNull: true },
    data: { type: 'date', notNull: true },
    criado_em: { type: 'timestamp', default: pgm.func('NOW()') }
  });

  pgm.createIndex('transacoes', 'usuario_id');
  pgm.createIndex('transacoes', 'data');
};

exports.down = (pgm) => {
  pgm.dropTable('transacoes');
  pgm.dropTable('usuarios');
};
//Comandos: npm install node-pg-migrate
//Comandos: mkdir migrations
//scripts em packpage.json (migrate 3x) up down  creat
//Comandos: npm run migrate:create -- init
//Script: Pesquisa de tabela simples
//Comandos: npm run migrate:up
//brew services start postgresql@16
