# Chat em Tempo Real

Um aplicativo de chat em tempo real desenvolvido com React, Node.js e Socket.IO, utilizando localStorage para persistência de dados.

## Tecnologias Utilizadas

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - Socket.IO Client

- Backend:
  - Node.js
  - Express
  - Socket.IO
  - TypeScript

## Como Executar o Projeto

### Pré-requisitos

- Node.js instalado
- NPM ou Yarn instalado

### Instalação

1. Clone o repositório
2. Instale as dependências do backend:
```bash
npm install
```

3. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

### Executando a Aplicação

1. Inicie o servidor backend (na pasta raiz do projeto):
```bash
npm run dev
```
O servidor estará rodando em `http://localhost:3001`

2. Em outro terminal, inicie o frontend (na pasta frontend):
```bash
cd frontend
npm start
```
O frontend estará disponível em `http://localhost:3000`

## Como Testar o Chat

1. Abra `http://localhost:3000` no seu navegador
2. Na primeira aba, digite seu nome e clique em "Entrar"
3. Abra uma nova aba do navegador também em `http://localhost:3000`
4. Na segunda aba, digite outro nome e clique em "Entrar"
5. Agora você pode trocar mensagens entre as duas abas

### Funcionalidades

- Chat em tempo real
- Persistência de mensagens usando localStorage
- Interface responsiva e moderna
- Identificação de usuários
- Timestamp nas mensagens

### Observações

- As mensagens são salvas no localStorage do navegador
- Cada usuário precisa ter um nome único
- O chat funciona em tempo real entre diferentes abas/janelas
- As mensagens são mantidas mesmo após recarregar a página

## Estrutura do Projeto

```
chat-app/
├── frontend/           # Aplicação React
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   └── ...
│   └── package.json
├── src/               # Backend Node.js
│   ├── server.ts      # Servidor Express
│   └── ...
└── package.json
```

## Desenvolvimento

Para desenvolvimento, o projeto utiliza:
- TypeScript para tipagem estática
- Hot-reload no backend (ts-node-dev)
- Hot-reload no frontend (react-scripts) 