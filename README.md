# Sistema de Monitoramento Ambiental - Backend

<div align="center">
  <h3>🌿 TecSus - Monitoramento Ambiental</h3>
  <p>Sistema backend para monitoramento ambiental em tempo real</p>
  
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
  ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
</div>

<div align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-documentação-da-api">API</a> •
  <a href="#-como-executar">Execução</a> •
  <a href="#-estrutura">Estrutura</a> •
  <a href="#-time">Time</a>
</div>

## 📋 Sobre

O Sistema de Monitoramento Ambiental é uma solução completa desenvolvida para a TecSus, focada no gerenciamento e monitoramento de dados ambientais. O backend é responsável por:

- Gerenciamento de estações de monitoramento
- Coleta e processamento de dados ambientais
- Sistema de alertas em tempo real
- Análise e validação de parâmetros ambientais

## 🚀 Tecnologias

### Core
- **Node.js** (v14+) - Ambiente de execução JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática
- **Express** - Framework web robusto e flexível
- **MySQL** - Sistema de gerenciamento de banco de dados

### Principais Dependências
- **TypeORM** - ORM para manipulação do banco de dados
- **JWT** - Autenticação e autorização via tokens
- **Express Rate Limit** - Controle de taxa de requisições
- **Cors** - Segurança para requisições cross-origin
- **Dotenv** - Gerenciamento de variáveis de ambiente

### Arquitetura e Padrões
- **Clean Architecture** - Separação clara de responsabilidades
- **SOLID** - Princípios de design de software
- **Repository Pattern** - Abstração da camada de dados
- **DTO Pattern** - Objetos de transferência de dados

## ⚙️ Funcionalidades

### 1. Sistema de Autenticação
- Login seguro com JWT
- Gerenciamento de níveis de acesso (Admin/Usuário)
- Recuperação e alteração de senha
- Proteção de rotas sensíveis

### 2. Gerenciamento de Estações
- Cadastro e configuração de estações
- Monitoramento em tempo real
- Histórico de medições
- Geolocalização de estações

### 3. Monitoramento de Parâmetros
- Configuração flexível de parâmetros
- Validação automática de dados
- Histórico de medições
- Exportação de dados

### 4. Sistema de Alertas
- Configuração de gatilhos
- Notificações em tempo real
- Histórico de alertas
- Níveis de prioridade

## 📚 Documentação da API

### Endpoints Principais

#### 🔐 Autenticação
```http
POST /auth/login          # Login do usuário
POST /auth/register       # Registro de novo usuário (Admin)
POST /auth/createpassword # Criação de senha inicial
```

#### 👥 Usuários
```http
PUT    /user/update          # Atualiza dados do usuário (Admin)
DELETE /user/delete/:id      # Remove usuário (Admin)
GET    /user/list           # Lista usuários (Admin)
GET    /user/read/:id       # Busca usuário específico
PUT    /user/change-password # Altera senha
```

#### 🚨 Alertas
```http
POST   /alert/create    # Cria alerta
PUT    /alert/update    # Atualiza alerta
GET    /alert/list      # Lista alertas
GET    /alert/read/:id  # Busca alerta
DELETE /alert/delete/:id # Remove alerta (Admin)
```

#### 📊 Medições
```http
POST   /measure/create    # Nova medição (Admin)
PUT    /measure/update    # Atualiza medição (Admin)
GET    /measure/list      # Lista medições
GET    /measure/read/:id  # Busca medição
DELETE /measure/delete/:id # Remove medição (Admin)
```

#### 🎯 Parâmetros
```http
POST   /parameter/create    # Novo parâmetro
PUT    /parameter/update    # Atualiza parâmetro
GET    /parameter/list      # Lista parâmetros
DELETE /parameter/delete/:id # Remove parâmetro (Admin)
```

#### 📍 Estações
```http
POST   /station/create    # Nova estação
PUT    /station/update    # Atualiza estação
GET    /station/list      # Lista estações
GET    /station/read/:id  # Busca estação
DELETE /station/delete/:id # Remove estação (Admin)
```

### Segurança

#### Níveis de Acesso
- **Público**: Endpoints sem autenticação
- **Usuário**: Requer token JWT válido
- **Admin**: Requer token JWT de administrador

#### Proteções
- Rate Limiting em todas as rotas
- Validação de dados via DTOs
- Sanitização de inputs
- Logs de segurança

## 🚦 Como Executar

### Pré-requisitos
- Node.js (v14 ou superior)
- MySQL
- npm ou yarn

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/Sync-FATEC/API-4-BACK.git
cd seu-repositorio
```

2. Instale as dependências
```bash
npm install
```

3. Configure o ambiente
```bash
cp .env.example .env
# Configure as variáveis no arquivo .env
```

4. Inicie o servidor
```bash
# Desenvolvimento
npm run dev
```

### Scripts Disponíveis
- `npm run dev`: Ambiente de desenvolvimento
- `npm run build`: Compilação TypeScript
- `npm start`: Ambiente de produção
- `npm run typeorm`: Comandos do TypeORM
- `npm run test`: Execução de testes

## 📁 Estrutura de Diretórios
```
├── application/     # Casos de uso e regras de negócio
│   ├── use-cases/  # Implementações dos casos de uso
│   └── services/   # Serviços da aplicação
├── domain/         # Entidades e interfaces
│   ├── models/     # Modelos de domínio
│   └── interfaces/ # Interfaces e contratos
├── infrastructure/ # Implementações concretas
│   ├── database/   # Configurações de banco de dados
│   ├── repositories/ # Implementações dos repositórios
│   └── middlewares/ # Middlewares da aplicação
└── web/           # Camada de apresentação
    ├── controllers/ # Controladores
    ├── routes/     # Rotas da API
    ├── dtos/       # Objetos de transferência de dados
    └── middlewares/ # Middlewares web
```

## 👥 Time

| Nome | Função |
|------|--------|
| João Gabriel Solis | Scrum Master |
| Ana Laura Moratelli | Product Owner |
| Arthur Karnas	 | Desenvolvedora |
| Erik Yokota | Desenvolvedor |
| Filipe Colla | Desenvolvedor |
| José Eduardo Fernandes | Desenvolvedor |
| Kauê Francisco | Desenvolvedor |

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
