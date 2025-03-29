# Sistema de Monitoramento Ambiental - Backend

<div align="center">
<a href="#descrição">Descrição</a> |
<a href="#tecnologias-utilizadas">Tecnologias</a> |
<a href="#funcionalidades-principais">Funcionalidades</a> |
<a href="#documentação-da-api">Documentação da API</a> |
<a href="#scripts-disponíveis">Scripts</a> |
<a href="#como-executar">Como Executar</a> |
<a href="#estrutura-de-diretórios">Estrutura</a> |
<a href="#contribuidores">Contribuidores</a>
</div>

## Descrição
Este é o backend do sistema de monitoramento ambiental desenvolvido para a Tecsus. O sistema é responsável por gerenciar estações de monitoramento, coletar dados ambientais, processar medições e gerar alertas baseados em parâmetros configurados.

## Tecnologias Utilizadas
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeORM** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **TypeScript** - Superset JavaScript tipado
- **Clean Architecture** - Arquitetura limpa
- **SOLID** - Princípios de design

## Funcionalidades Principais

### 1. Autenticação e Autorização
- Login de usuários
- Registro de novos usuários (admin)
- Gerenciamento de senhas
- Proteção de rotas

### 2. Gerenciamento de Estações
- Cadastro de estações de monitoramento
- Configuração de parâmetros por estação
- Monitoramento em tempo real
- Histórico de dados

### 3. Monitoramento de Parâmetros
- Configuração de tipos de parâmetros
- Coleta de dados
- Processamento de medições
- Validação de dados

### 4. Sistema de Alertas
- Configuração de tipos de alertas
- Regras de comparação
- Notificações automáticas
- Histórico de alertas

### 5. Recebimento de Dados
- Endpoint para recebimento de JSON
- Validação de dados
- Processamento assíncrono
- Rate limiting

## Documentação da API

### Segurança
- Autenticação via JWT
- Rate limiting
- Middleware de autenticação
- Middleware de autenticação admin
- Validação de dados
- Tratamento de erros

## Scripts Disponíveis
- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o código TypeScript
- `npm run start` - Inicia o servidor em produção
- `npm run typeorm` - Executa comandos do TypeORM
- `npm run test` - Executa testes (quando implementados)

## Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- MySQL
- npm ou yarn

### Configuração
1. Clone o repositório
2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrações
```bash
npm run typeorm migration:run
```

5. Inicie o servidor
```bash
# Desenvolvimento
npm run dev
```

## Estrutura de Diretórios
```
src/
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

## Contribuidores
- João Gabriel Solis (Scrum Master)
- Ana Laura Moratelli (Product Owner)
- Ana Clara Marques (Desenvolvedora)
- Erik Yokota (Desenvolvedor)
- Filipe Colla (Desenvolvedor)
- Kauê Francisco (Desenvolvedor)

## Licença
Este projeto está sob a licença [MIT_LICENSE](). Veja o arquivo [LICENSE](LICENSE) para mais detalhes.