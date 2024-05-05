# GetACapy

Este é um projeto de sistema de adoção de capivaras desenvolvido em Node.js, Express e MongoDB. Ele fornece uma API para operações relacionadas à gestão de usuários, cadastro e adoção de capivaras.

## Configuração

1. **Instalação de Dependências:** Antes de executar o projeto, certifique-se de ter todas as dependências instaladas. Você pode instalá-las executando o seguinte comando no terminal na pasta raiz do projeto:

```
npm install bcrypt cookie-parser cors express jsonwebtoken mongoose multer nodemon
```

2. **Configuração do Banco de Dados:** Certifique-se de ter um banco de dados MongoDB configurado. Você pode configurar a conexão do banco de dados no arquivo `db/conn.js`.

3. **Execução do Servidor:** Para iniciar o servidor, execute o seguinte comando na pasta raiz do projeto:

```
npm start
```

## Funcionalidades da API

### Usuários

- **Cadastro de Usuário:** Endpoint para registrar um novo usuário.  
  **Rota:** `POST /users/register`

- **Login de Usuário:** Endpoint para autenticar um usuário.  
  **Rota:** `POST /users/login`

- **Verificar Usuário:** Endpoint para verificar o usuário atualmente autenticado.  
  **Rota:** `GET /users/checkuser`

- **Buscar Usuário por ID:** Endpoint para buscar um usuário pelo ID.  
  **Rota:** `GET /users/:id`

- **Editar Usuário:** Endpoint para editar os dados de um usuário autenticado.  
  **Rota:** `PATCH /users/edit/:id`

### Capivaras

- **Cadastro de Capivara:** Endpoint para cadastrar uma nova capivara.  
  **Rota:** `POST /capys/create`

- **Listar Todas as Capivaras:** Endpoint para listar todas as capivaras disponíveis.  
  **Rota:** `GET /capys`

- **Listar Capivaras do Usuário:** Endpoint para listar as capivaras cadastradas pelo usuário autenticado.  
  **Rota:** `GET /capys/mycapys`

- **Listar Adoções do Usuário:** Endpoint para listar as capivaras adotadas pelo usuário autenticado.  
  **Rota:** `GET /capys/myadoptions`

- **Buscar Capivara por ID:** Endpoint para buscar uma capivara pelo ID.  
  **Rota:** `GET /capys/:id`

- **Remover Capivara por ID:** Endpoint para remover uma capivara pelo ID.  
  **Rota:** `DELETE /capys/:id`

- **Atualizar Capivara por ID:** Endpoint para atualizar os dados de uma capivara pelo ID.  
  **Rota:** `PATCH /capys/:id`

- **Agendar Visita para Capivara:** Endpoint para agendar uma visita para adoção de uma capivara.  
  **Rota:** `PATCH /capys/schedule/:id`

- **Concluir Adoção de Capivara:** Endpoint para concluir o processo de adoção de uma capivara.  
  **Rota:** `PATCH /capys/conclude/:id`

## Estrutura do Projeto

- **index.js:** Arquivo principal do servidor, configuração do Express e definição das rotas.

- **routes/UserRoutes.js:** Definição das rotas relacionadas aos usuários.

- **routes/CapyRoutes.js:** Definição das rotas relacionadas às capivaras.

- **models/User.js:** Modelo de dados para os usuários.

- **models/Capy.js:** Modelo de dados para as capivaras.

- **controllers/UserController.js:** Controladores para as operações relacionadas aos usuários.

- **controllers/CapyController.js:** Controladores para as operações relacionadas às capivaras.

- **helpers:** Pasta contendo funções auxiliares para autenticação, upload de imagens, entre outros.
