# Gestão Financeira — Backend

API REST desenvolvida em **Node.js + Express** com autenticação JWT e banco de dados **PostgreSQL**.

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | ^4.19 | Framework HTTP |
| PostgreSQL | 14+ | Banco de dados |
| pg | ^8.12 | Driver PostgreSQL |
| bcryptjs | ^2.4 | Hash de senhas |
| jsonwebtoken | ^9.0 | Autenticação JWT |
| dotenv | ^16.4 | Variáveis de ambiente |
| cors | ^2.8 | Liberação de origens |
| nodemon | ^3.1 | Hot reload em desenvolvimento |

---

## Estrutura do projeto

```
back/
├── src/
│   ├── config/
│   │   └── db.js                   # Pool de conexão com o PostgreSQL
│   ├── controllers/
│   │   ├── authController.js       # Lógica de registro e login
│   │   └── transacoesController.js # CRUD de transações
│   ├── middleware/
│   │   └── autenticar.js           # Validação do JWT
│   ├── routes/
│   │   ├── auth.js                 # Rotas de autenticação
│   │   └── transacoes.js           # Rotas de transações
│   └── server.js                   # Entrada da aplicação
├── banco.sql                       # Script de criação das tabelas
├── .env.example                    # Modelo de variáveis de ambiente
├── package.json
└── README.md
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [PostgreSQL](https://www.postgresql.org/) v14 ou superior

---

## Como rodar

### 1. Instalar dependências

```bash
cd back
npm install
```

### 2. Configurar o banco de dados

No psql ou no DBeaver, crie o banco e execute o script de tabelas:

```sql
CREATE DATABASE financas;
```

Depois execute o arquivo `banco.sql` no banco `financas`. Ele criará as tabelas:

- `usuarios` — armazena os dados de conta dos usuários
- `transacoes` — armazena as receitas e despesas vinculadas a cada usuário

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=financas

JWT_SECRET=uma_string_longa_e_aleatoria

PORT=3000
```

### 4. Iniciar o servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

O servidor sobe em: `http://localhost:3000`

---

## Endpoints da API

### Autenticação

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/registrar` | Não | Cria um novo usuário |
| POST | `/auth/login` | Não | Autentica e retorna o JWT |

**POST `/auth/registrar`**
```json
// Body
{ "nome": "Luquian", "email": "luquian@email.com", "senha": "123456" }

// Resposta 201
"Usuário cadastrado com sucesso!"
```

**POST `/auth/login`**
```json
// Body
{ "email": "luquian@email.com", "senha": "123456" }

// Resposta 200
{ "id": 1, "nome": "Luquian", "token": "eyJhbGci..." }
```

---

### Transações

> Todas as rotas abaixo exigem o header:
> `Authorization: Bearer <token>`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/transacoes/usuario/:id` | Lista todas as transações do usuário |
| POST | `/transacoes/usuario/:id` | Cria uma nova transação |
| PUT | `/transacoes/:id` | Atualiza uma transação existente |
| DELETE | `/transacoes/:id` | Remove uma transação |

**Body para POST e PUT:**
```json
{
  "descricao": "Salário",
  "valor": 3500.00,
  "tipo": "RECEITA",
  "categoria": "Renda",
  "data": "2026-03-01"
}
```

> O campo `tipo` aceita apenas `RECEITA` ou `DESPESA`.

---

## Segurança

- Senhas armazenadas com hash **bcrypt** (salt rounds: 10)
- Todas as rotas de transações protegidas por **JWT Bearer Token**
- Um usuário só acessa, edita e exclui as **próprias** transações
- Variáveis sensíveis isoladas no `.env`

---

## Modelo do banco de dados

```
USUARIOS
├── id          SERIAL PRIMARY KEY
├── nome        VARCHAR(100)
├── email       VARCHAR(150) UNIQUE
├── senha       VARCHAR(255)   ← hash bcrypt
└── criado_em   TIMESTAMP

TRANSACOES
├── id          SERIAL PRIMARY KEY
├── usuario_id  INTEGER → USUARIOS(id) ON DELETE CASCADE
├── descricao   VARCHAR(255)
├── valor       NUMERIC(12,2)
├── tipo        VARCHAR(10)    ← 'RECEITA' | 'DESPESA'
├── categoria   VARCHAR(100)
├── data        DATE
└── criado_em   TIMESTAMP
```
