# Finance App API

Uma aplicação de API REST para gerenciamento de finanças pessoais, construída com arquitetura em camadas, padrões de projeto avançados e boas práticas de desenvolvimento.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias e Dependências](#tecnologias-e-dependências)
- [Arquitetura da Aplicação](#arquitetura-da-aplicação)
- [Padrões de Projeto](#padrões-de-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Configuração e Instalação](#configuração-e-instalação)
- [Como Usar a Aplicação](#como-usar-a-aplicação)
- [Endpoints da API](#endpoints-da-api)
- [Executar Testes](#executar-testes)
- [Qualidade de Código](#qualidade-de-código)
- [Boas Práticas Implementadas](#boas-práticas-implementadas)

---

## 🎯 Visão Geral

A Finance App API é uma aplicação backend para gerenciar:

- **Usuários**: Cadastro, autenticação, login, atualização e exclusão de contas
- **Transações**: Criação, leitura, atualização e exclusão de transações financeiras
- **Saldos**: Cálculo de saldo do usuário com filtros de data

### Características Principais

✅ Autenticação e autorização via JWT  
✅ Validação de dados com Zod  
✅ Testes unitários e e2e com Jest & Supertest 
✅ Arquitetura em camadas bem definida  
✅ Padrões de projeto (Factory, Adapter, Repository)  
✅ Documentação Swagger 
✅ Suporte a CORS  
✅ Gerenciamento de banco de dados com Prisma ORM  
✅ Linting e formatação de código  
✅ Git hooks com Husky e Lint-staged
✅ CI/CD com GitHub Actions

---

## 🛠️ Tecnologias e Dependências

### Runtime & Framework

| Tecnologia | Versão | Descrição |
|---|---|---|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | 5.2.1 | Framework web minimalista |

### Banco de Dados

| Tecnologia | Versão | Descrição |
|---|---|---|
| **PostgreSQL** | 16 | Banco de dados relacional |
| **Prisma** | 5.22.0 | ORM (Object-Relational Mapping) |

### Autenticação & Segurança

| Tecnologia | Versão | Descrição |
|---|---|---|
| **JWT (jsonwebtoken)** | 9.0.3 | Autenticação baseada em tokens |
| **bcryptjs** | 3.0.3 | Hash seguro de senhas |
| **validator** | 13.15.35 | Validação de dados |
| **Zod** | 4.4.3 | Validação de schemas TypeScript-first |

### Utilitários

| Tecnologia | Versão | Descrição |
|---|---|---|
| **uuid** | 8.3.2 | Geração de IDs únicos |
| **dayjs** | 1.11.21 | Manipulação de datas e horas |
| **CORS** | 2.8.6 | Compartilhamento de recursos entre origens |
| **Swagger UI Express** | 5.0.1 | Interface visual da API |
| **dotenv** | 17.4.2 | Gerenciamento de variáveis de ambiente |

### Desenvolvimento & Testing

| Tecnologia | Versão | Descrição |
|---|---|---|
| **Jest** | 30.4.2 | Framework de testes |
| **Supertest** | 7.2.2 | Testes HTTP |
| **Faker** | 10.4.0 | Geração de dados fake para testes |
| **ESLint** | 10.3.0 | Linter de código JavaScript |
| **Prettier** | 3.8.3 | Formatador de código |
| **Husky** | 9.1.7 | Git hooks |
| **Lint-staged** | 16.4.0 | Executa linters em arquivos staged |

---

## 🏗️ Arquitetura da Aplicação

A aplicação segue uma **arquitetura em camadas** (Layered Architecture) que separa as responsabilidades em diferentes níveis:

```
┌─────────────────────────────────────────────────────┐
│                    ROTAS (Routes)                    │
│              Express Route Handlers                  │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                 CONTROLLERS                          │
│    Recebem requisições e retornam respostas         │
│    Validam entrada usando Zod                        │
│    Tratam erros específicos                          │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                   USE CASES                          │
│    Implementam lógica de negócio (Business Logic)   │
│    Orquestram operações entre Repository e Adapters│
│    Independentes de frameworks                       │
└─────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┬─────────────────┐
        ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ REPOSITORIES │  │  ADAPTERS    │  │  MIDDLEWARES │
│              │  │              │  │              │
│ - Postgres   │  │ - Password   │  │ - Auth       │
│ - User CRUD  │  │ - Token      │  │              │
│ - Transaction│  │ - ID Gen     │  │              │
│   CRUD       │  │ - Hash       │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
        ↓                 ↓
┌─────────────────────────────────────────────────────┐
│                   PRISMA ORM                         │
│              PostgreSQL Database                     │
└─────────────────────────────────────────────────────┘
```

### Camadas da Aplicação

#### 1. **Routes** (Rotas)
Define os endpoints HTTP e mapeia para os controllers.

**Localização:** `src/routes/`  
**Responsabilidades:**
- Definir rotas HTTP (GET, POST, PATCH, DELETE)
- Aplicar middlewares (autenticação)
- Desserializar requisições

#### 2. **Controllers** (Controladores)
Recebem as requisições HTTP, processam e retornam respostas.

**Localização:** `src/controllers/`  
**Responsabilidades:**
- Validar entrada (Zod)
- Chamar use cases
- Tratar erros específicos
- Formatar resposta HTTP

#### 3. **Use Cases** (Casos de Uso)
Implementam a lógica de negócio da aplicação.

**Localização:** `src/use-cases/`  
**Responsabilidades:**
- Implementar regras de negócio
- Orquestar operações entre repositories e adapters
- Ser independentes de frameworks
- Lançar exceções de negócio

#### 4. **Repositories** (Repositórios)
Abstraem o acesso aos dados do banco de dados.

**Localização:** `src/repositories/postgres/`  
**Responsabilidades:**
- Executar operações CRUD
- Usar Prisma ORM
- Retornar dados brutos ou entidades

#### 5. **Adapters** (Adaptadores)
Implementam funcionalidades externas e as adaptam à aplicação.

**Localização:** `src/adapters/`  
**Responsabilidades:**
- Criptografia de senhas (bcryptjs)
- Geração de tokens JWT
- Geração de IDs únicos (UUID)
- Verificação de tokens

#### 6. **Middlewares** (Intermediários)
Processam requisições antes delas chegarem aos controllers.

**Localização:** `src/middlewares/`  
**Responsabilidades:**
- Autenticação (JWT)
- Validação de tokens
- Injeção de userId na requisição

#### 7. **Errors** (Erros)
Exceções personalizadas para tratamento de erros de negócio.

**Localização:** `src/errors/`  
**Exemplos:**
- `EmailAlreadyInUser`: Email já registrado
- `UserNotFoundError`: Usuário não encontrado
- `InvalidPasswordError`: Senha inválida
- `TransactionForbiden`: Acesso negado à transação

---

## 🎨 Padrões de Projeto

### 1. **Factory Pattern** (Padrão Fábrica)

Cria instâncias complexas de controllers, injetando todas as dependências.

**Localização:** `src/factories/controllers/`

**Exemplo:**
```javascript
export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const passwordHasherAdapter = new PasswordHasherAdapter();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();
  
  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    createUserRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
    tokensGeneratorAdapter,
  );

  const createUserController = new CreateUserController(createUserUseCase);
  
  return createUserController;
};
```

**Benefícios:**
✅ Centraliza a criação de objetos  
✅ Facilita testes (mock de dependências)  
✅ Reduz acoplamento  
✅ Reutiliza lógica de inicialização  

### 2. **Adapter Pattern** (Padrão Adaptador)

Encapsula bibliotecas externas em classes que implementam uma interface consistente.

**Localização:** `src/adapters/`

**Exemplo:**
```javascript
// Adapta bcryptjs para a aplicação
export class PasswordHasherAdapter {
  async execute(password) {
    return await bcrypt.hash(password, 10);
  }
}

// Adapta UUID para a aplicação
export class IdGeneratorAdapter {
  execute() {
    return v4();
  }
}
```

**Benefícios:**
✅ Descacopla de bibliotecas externas  
✅ Facilita mudança de bibliotecas  
✅ Cria interface consistente  
✅ Facilita testes com mocks  

### 3. **Repository Pattern** (Padrão Repositório)

Abstrai o acesso aos dados, criando uma camada entre a lógica de negócio e o banco de dados.

**Localização:** `src/repositories/postgres/`

**Exemplo:**
```javascript
export class PostgresCreateUserRepository {
  async execute(userData) {
    return await prisma.user.create({
      data: userData,
    });
  }
}
```

**Benefícios:**
✅ Abstrai implementação do banco de dados  
✅ Facilita testes (mock de dados)  
✅ Permite trocar banco de dados facilmente  
✅ Centraliza queries no banco  

### 4. **Dependency Injection** (Injeção de Dependência)

Passa dependências como parâmetros ao invés de criá-las internamente.

**Exemplo:**
```javascript
export class CreateUserUseCase {
  constructor(
    getUserByEmailRepository,
    createUserRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
    tokensGeneratorAdapter,
  ) {
    // Armazena as dependências
  }
}
```

**Benefícios:**
✅ Reduz acoplamento  
✅ Facilita testes  
✅ Permite reutilizar componentes  
✅ Melhora a testabilidade  

---

## 📁 Estrutura de Pastas

```
finance-app/
├── src/
│   ├── __tests__/                      # Testes compartilhados
│   │   └── fixtures/                   # Dados de teste
│   │
│   ├── adapters/                       # Adaptadores de bibliotecas externas
│   │   ├── password-hasher.js         # Criptografia com bcryptjs
│   │   ├── password-comparator.js      # Comparação de senhas
│   │   ├── tokens-generator.js         # Geração de JWT
│   │   ├── token-verifier.js           # Verificação de JWT
│   │   ├── id-generator.js             # Geração de UUIDs
│   │   └── index.js
│   │
│   ├── controllers/                    # Controladores HTTP
│   │   ├── user/
│   │   │   ├── create-user.js
│   │   │   ├── get-user-by-id.js
│   │   │   ├── login-user.js
│   │   │   ├── refresh-token.js
│   │   │   ├── update-user.js
│   │   │   ├── delete-user.js
│   │   │   ├── get-user-balance.js
│   │   │   └── *.test.js
│   │   │
│   │   ├── transaction/
│   │   │   ├── create-transaction.js
│   │   │   ├── get-transaction-by-user-id.js
│   │   │   ├── update-transaction.js
│   │   │   ├── delete-transaction.js
│   │   │   └── *.test.js
│   │   │
│   │   ├── helpers/                    # Funções auxiliares
│   │   └── index.js
│   │
│   ├── errors/                         # Exceções personalizadas
│   │   ├── user.js
│   │   ├── transaction.js
│   │   └── index.js
│   │
│   ├── factories/                      # Padrão Factory
│   │   └── controllers/
│   │       ├── user.js
│   │       ├── transaction.js
│   │       └── index.js
│   │
│   ├── middlewares/                    # Middleware Express
│   │   └── auth.js                     # Autenticação JWT
│   │
│   ├── repositories/                   # Acesso aos dados
│   │   └── postgres/
│   │       ├── user/
│   │       │   ├── create-user.js
│   │       │   ├── get-user-by-id.js
│   │       │   ├── get-user-by-email.js
│   │       │   ├── update-user.js
│   │       │   ├── delete-user.js
│   │       │   └── get-user-balance.js
│   │       │
│   │       ├── transaction/
│   │       │   ├── create-transaction.js
│   │       │   ├── get-transaction-by-user-id.js
│   │       │   ├── update-transaction.js
│   │       │   ├── delete-transaction.js
│   │       │   └── get-transaction-by-id.js
│   │       │
│   │       └── index.js
│   │
│   ├── routes/                         # Definição de rotas
│   │   ├── user.js
│   │   ├── transaction.js
│   │   └── index.js
│   │
│   ├── schemas/                        # Schemas de validação (Zod)
│   │   ├── user.js
│   │   ├── transactions.js
│   │   └── index.js
│   │
│   ├── use-cases/                      # Lógica de negócio
│   │   ├── user/
│   │   │   ├── create-user.js
│   │   │   ├── get-user-by-id.js
│   │   │   ├── login-user.js
│   │   │   ├── refresh-token.js
│   │   │   ├── update-user.js
│   │   │   ├── delete-user.js
│   │   │   ├── get-user-balance.js
│   │   │   └── *.test.js
│   │   │
│   │   ├── transaction/
│   │   │   ├── create-transaction.js
│   │   │   ├── get-transaction-by-user-id.js
│   │   │   ├── update-transaction.js
│   │   │   ├── delete-transaction.js
│   │   │   └── *.test.js
│   │   │
│   │   └── index.js
│   │
│   ├── app.js                          # Configuração do Express
│   └── index.js                        # Entry point
│
├── prisma/
│   ├── schema.prisma                   # Modelo de dados
│   └── migrations/                     # Migrações do banco
│
├── docs/
│   └── swagger.json                    # Documentação OpenAPI
│
├── coverage/                           # Cobertura de testes
├── generated/                          # Código gerado (Prisma Client)
│
├── .env                                # Variáveis de ambiente (não versionar)
├── .env.example                        # Template de variáveis
├── .env.test                           # Variáveis para testes
├── .husky/                             # Git hooks
├── .github/                            # Configurações GitHub
│
├── docker-compose.yml                  # Orquestração de containers
├── eslint.config.js                    # Configuração ESLint
├── jest.config.js                      # Configuração Jest
├── jest.global-setup.js                # Setup global dos testes
├── jest.setup.js                       # Setup dos testes
├── .prettierrc.json                    # Configuração Prettier
├── .lintstagedrc.json                  # Configuração lint-staged
│
├── package.json                        # Dependências e scripts
├── package-lock.json                   # Lock de versões
└── README.md                           # Este arquivo
```

---

## 🚀 Configuração e Instalação

### Pré-requisitos

- **Node.js** 18.0.0 ou superior
- **npm** 9.0.0 ou superior
- **Docker** e **Docker Compose** (para executar PostgreSQL)
- **Git** (opcional, para controle de versão)

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/finance-app.git
cd finance-app
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Aplicação
PORT=3000

# JWT
JWT_ACCESS_TOKEN_SECRET_KEY=sua_chave_secreta_aqui
JWT_REFRESH_TOKEN_SECRET_KEY=sua_chave_refresh_secreta_aqui

# Database URL
DATABASE_URL=postgresql://root:password@localhost:5432/financeapp
```

### Passo 4: Iniciar o Banco de Dados

```bash
docker-compose up -d
```

Isso inicia dois containers PostgreSQL:
- **Produção:** localhost:5432
- **Testes:** localhost:5433

### Passo 5: Executar Migrações

```bash
npx prisma migrate dev
```

Isso cria as tabelas no banco de dados baseado no schema.

### Passo 6: Iniciar a Aplicação

**Modo desenvolvimento (com hot reload):**
```bash
npm run start:dev
```

**Modo produção:**
```bash
npm start
```

A aplicação estará disponível em: `http://localhost:3000`

A documentação Swagger estará em: `http://localhost:3000/docs`

---

## 📡 Como Usar a Aplicação

### Acessar Documentação Swagger

Abra seu navegador e vá para:
```
http://localhost:3000/docs
```

### Fluxo de Uso Típico

#### 1️⃣ Criar uma Conta

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "João",
    "last_name": "Silva",
    "email": "joao@example.com",
    "password": "SenhaForte123!"
  }'
```

**Resposta (201 Created):**
```json
{
  "id": "uuid-aqui",
  "first_name": "João",
  "last_name": "Silva",
  "email": "joao@example.com",
  "accessToken": "jwt-token-aqui",
  "refreshToken": "jwt-refresh-token-aqui"
}
```

#### 2️⃣ Fazer Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "SenhaForte123!"
  }'
```

**Resposta (200 OK):**
```json
{
  "accessToken": "jwt-token-aqui",
  "refreshToken": "jwt-refresh-token-aqui"
}
```

#### 3️⃣ Obter Dados do Usuário

Use o `accessToken` recebido no login:

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer seu-access-token-aqui"
```

**Resposta (200 OK):**
```json
{
  "id": "uuid-aqui",
  "first_name": "João",
  "last_name": "Silva",
  "email": "joao@example.com"
}
```

#### 4️⃣ Criar uma Transação

```bash
curl -X POST http://localhost:3000/api/transactions/me \
  -H "Authorization: Bearer seu-access-token-aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Salário",
    "type": "EARNING",
    "amount": 5000.00,
    "date": "2026-06-09"
  }'
```

**Resposta (201 Created):**
```json
{
  "id": "uuid-aqui",
  "user_id": "uuid-do-usuario",
  "name": "Salário",
  "type": "EARNING",
  "amount": 5000.00,
  "date": "2026-06-09"
}
```

#### 5️⃣ Listar Transações do Usuário

```bash
curl -X GET "http://localhost:3000/api/transactions/me?from=2026-01-01&to=2026-12-31" \
  -H "Authorization: Bearer seu-access-token-aqui"
```

**Resposta (200 OK):**
```json
[
  {
    "id": "uuid-aqui",
    "user_id": "uuid-do-usuario",
    "name": "Salário",
    "type": "EARNING",
    "amount": 5000.00,
    "date": "2026-06-09"
  }
]
```

#### 6️⃣ Obter Saldo do Usuário

```bash
curl -X GET "http://localhost:3000/api/users/me/balance?from=2026-01-01&to=2026-12-31" \
  -H "Authorization: Bearer seu-access-token-aqui"
```

**Resposta (200 OK):**
```json
{
  "earnings": 5000.00,
  "expenses": 500.00,
  "investments": 1000.00,
  "balance": 3500.00
}
```

#### 7️⃣ Atualizar Transação

```bash
curl -X PATCH "http://localhost:3000/api/transactions/me/uuid-da-transacao" \
  -H "Authorization: Bearer seu-access-token-aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Salário Ajustado",
    "amount": 5500.00
  }'
```

#### 8️⃣ Deletar Transação

```bash
curl -X DELETE "http://localhost:3000/api/transactions/me/uuid-da-transacao" \
  -H "Authorization: Bearer seu-access-token-aqui"
```

---

## 📚 Endpoints da API

### Autenticação

Todos os endpoints protegidos requerem o header:
```
Authorization: Bearer <seu-access-token>
```

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/api/users` | Criar novo usuário | ❌ Não |
| `POST` | `/api/users/login` | Fazer login | ❌ Não |
| `GET` | `/api/users/me` | Obter dados do usuário logado | ✅ Sim |
| `GET` | `/api/users/me/balance` | Obter saldo do usuário | ✅ Sim |
| `PATCH` | `/api/users/:userId` | Atualizar dados do usuário | ✅ Sim |
| `DELETE` | `/api/users/:userId` | Deletar usuário | ✅ Sim |
| `POST` | `/api/users/refresh-token` | Renovar access token | ✅ Sim |

### Transações

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `GET` | `/api/transactions/me` | Listar transações do usuário | ✅ Sim |
| `POST` | `/api/transactions/me` | Criar nova transação | ✅ Sim |
| `PATCH` | `/api/transactions/me/:transactionId` | Atualizar transação | ✅ Sim |
| `DELETE` | `/api/transactions/me/:transactionId` | Deletar transação | ✅ Sim |

### Documentação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/docs` | Documentação Swagger/OpenAPI |

---

## 🧪 Executar Testes

### Executar Todos os Testes

```bash
npm test
```

Isso executa todos os testes e exibe um resumo.

### Executar Testes em Modo Watch

Roda os testes novamente toda vez que você salva um arquivo:

```bash
npm run test:watch
```

### Gerar Relatório de Cobertura

```bash
npm run test:coverage
```

Gera um relatório HTML de cobertura em `coverage/lcov-report/index.html`

### Tipos de Testes

#### Testes Unitários (Unit Tests)
- **Localização:** `src/**/*.test.js`
- **O que testam:** Funções isoladas, lógica de negócio
- **Exemplo:** Testar criação de usuário sem banco de dados

#### Testes de Integração/E2E (End-to-End)
- **Localização:** `src/routes/*.e2e.test.js`
- **O que testam:** Fluxos completos através de rotas HTTP
- **Exemplo:** Criar usuário → fazer login → criar transação

### Estrutura de um Teste

```javascript
describe("CreateUserUseCase", () => {
  it("should create a new user", async () => {
    // Arrange - Preparar dados
    const userData = {
      first_name: "João",
      last_name: "Silva",
      email: "joao@example.com",
      password: "SenhaForte123!"
    };

    // Act - Executar ação
    const result = await createUserUseCase.execute(userData);

    // Assert - Verificar resultado
    expect(result).toHaveProperty("id");
    expect(result.email).toBe(userData.email);
  });

  it("should throw error if email already exists", async () => {
    // Arrange
    const userData = { email: "existente@example.com" };

    // Act & Assert
    await expect(
      createUserUseCase.execute(userData)
    ).rejects.toThrow(EmailAlreadyInUser);
  });
});
```

---

## 🎨 Qualidade de Código

### ESLint - Verificar Qualidade

```bash
npm run eslint:check
```

Verifica problemas de qualidade e padrões no código.

### Prettier - Formatar Código

```bash
npm run prettier:check
```

Verifica se o código está formatado corretamente.

### Husky & Lint-staged

Automaticamente verifica qualidade de código em cada commit:

**Hooks instalados:**
- **pre-commit:** Executa ESLint e Prettier em arquivos modificados
- **commit-msg:** Valida mensagem de commit com git-commit-msg-linter

### Configurações

**ESLint:** `eslint.config.js`  
**Prettier:** `.prettierrc.json`  
**Lint-staged:** `.lintstagedrc.json`

---

## 💡 Boas Práticas Implementadas

### 1. **Arquitetura em Camadas**

✅ Separação clara de responsabilidades  
✅ Cada camada tem um propósito específico  
✅ Reduz acoplamento entre componentes  
✅ Facilita manutenção e testes  

### 2. **Padrão Repository**

✅ Abstrai operações de banco de dados  
✅ Facilita testes com mocks  
✅ Permite trocar banco de dados sem afetar lógica  
✅ Centraliza queries em um único lugar  

### 3. **Injeção de Dependência**

✅ Reduz acoplamento entre classes  
✅ Facilita testes (mock de dependências)  
✅ Permite reutilizar componentes  
✅ Melhora a testabilidade  

### 4. **Padrão Factory**

✅ Centraliza criação de objetos complexos  
✅ Facilita mudanças na inicialização  
✅ Reduz duplicação de código  
✅ Melhora legibilidade das rotas  

### 5. **Padrão Adapter**

✅ Desacopla de bibliotecas externas  
✅ Facilita trocar de dependências  
✅ Cria interface consistente  
✅ Melhora testabilidade  

### 6. **Validação com Zod**

✅ Validação de tipos em tempo de execução  
✅ Mensagens de erro claras  
✅ Suporte a TypeScript (opcional)  
✅ Composição de schemas  

### 7. **Tratamento de Erros**

✅ Exceções personalizadas para diferentes casos  
✅ Tratamento consistente em controllers  
✅ Mensagens de erro descritivas  
✅ Status HTTP apropriados  

### 8. **Autenticação e Autorização**

✅ JWT para autenticação stateless  
✅ Refresh tokens para segurança  
✅ Senhas criptografadas com bcryptjs  
✅ Middleware de autenticação reutilizável  

### 9. **Testes Abrangentes**

✅ Testes unitários para lógica de negócio  
✅ Testes e2e para fluxos completos  
✅ Relatório de cobertura  
✅ Fixtures e factories para dados de teste  

### 10. **Qualidade de Código**

✅ ESLint para padrão de código  
✅ Prettier para formatação consistente  
✅ Git hooks com Husky  
✅ Validação em cada commit  

### 11. **Versionamento Semântico**

```
MAJOR.MINOR.PATCH
1.0.0
├── MAJOR: Mudanças incompatíveis
├── MINOR: Novas funcionalidades compatíveis
└── PATCH: Correções de bugs
```

### 12. **Variáveis de Ambiente**

✅ Configuração externa via `.env`  
✅ Diferentes ambientes (dev, test, prod)  
✅ Valores sensíveis protegidos  
✅ Template com `.env.example`  

### 13. **Documentação**

✅ README.md abrangente  
✅ Documentação Swagger 
✅ Comentários no código  
✅ Commits com mensagens descritivas  

---

## 📖 Referências e Recursos

### Documentação Oficial

- [Express.js](https://expressjs.com/) - Framework web
- [Prisma ORM](https://www.prisma.io/docs/) - ORM para banco de dados
- [JWT.io](https://jwt.io/) - JSON Web Tokens
- [Zod](https://zod.dev/) - Validação de schemas
- [Jest](https://jestjs.io/) - Framework de testes
- [ESLint](https://eslint.org/) - Linter JavaScript
- [Prettier](https://prettier.io/) - Formatador de código

### Padrões de Projeto

- [Design Patterns - Refactoring Guru](https://refactoring.guru/design-patterns)
- [Clean Code - Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [Clean Architecture - Robert C. Martin](https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/)

---

## 👤 Autor

**Davi Fernandes**

- GitHub: [davifdev](https://github.com)
- Email: davi.fer159@gmail.com

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## ⭐ Se este projeto foi útil para você, considere dar uma estrela! ⭐

---

**Última atualização:** 09 de junho de 2026
