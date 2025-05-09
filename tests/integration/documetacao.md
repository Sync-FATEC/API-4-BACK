# 📘 Documentação de Testes de Integração - Equipe Sync

## 🔍 O que são Testes de Integração?

Os testes de integração validam a interação entre múltiplos componentes ou camadas do sistema. Diferente dos testes unitários, que testam funções isoladas, os testes de integração verificam como diferentes partes do sistema trabalham juntas. No nosso contexto, validamos principalmente:

### Back-end
- A interação entre use cases, repositórios e banco de dados
- O fluxo completo de dados entre a aplicação e o banco de dados
- A execução das regras de negócio de ponta a ponta

### Front-end
- A interação entre componentes React, contextos e serviços
- O fluxo de dados entre a interface e as APIs (mockadas)
- A navegação entre páginas e o comportamento dos componentes em diferentes estados
- A validação de ciclos completos de interação do usuário

## ⚙️ Processo de Definição dos Testes de Integração

### 📌 Como os Testes São Definidos?

Os testes de integração são definidos com base nos **critérios de aceitação** estabelecidos pelo **Product Owner (PO)** durante o **planejamento da sprint**. Esses critérios descrevem os comportamentos esperados da funcionalidade e servem como referência direta para a criação dos testes automatizados.

Além disso, **o time valida coletivamente, durante a sprint review**, o que realmente precisa ser coberto por testes de integração — priorizando fluxos críticos e pontos de maior risco.

Durante o desenvolvimento, os desenvolvedores são responsáveis por implementar os testes com foco em:

- Validar o comportamento da aplicação de ponta a ponta (atravessando todas as camadas);
- Garantir a integração correta entre *use cases*, repositórios e banco de dados;
- Verificar se os dados fluem corretamente entre entrada (DTOs), lógica de negócio e persistência;
- Confirmar que erros e exceções previstos são tratados e retornados de forma adequada.

### 👥 Papéis e Responsabilidades

- **Product Owner (PO)**
  - Define os critérios de aceitação com base nas regras de negócio.
  - Esses critérios norteiam os testes automatizados.

- **Desenvolvedores**
  - Implementam os testes de integração com base nos critérios definidos.
  - Garantem que o comportamento do sistema está correto em cenários reais.
  - Utilizam seeds e utilitários padronizados para preparar os dados de teste.

- **DevOps (Teste de integração)**
  - Apoia na padronização de boas práticas.
  - Mantém exemplos reutilizáveis (seeds, setup, etc).

## 🧑‍💻 Fluxo Completo para o Desenvolvedor

### 1. Analise os Requisitos
- Consulte o Jira para entender a funcionalidade.
- Identifique os critérios de aceitação e regras de negócio.
- Mapeie os *use cases* envolvidos na implementação e nos testes.

### 2. Planeje os Testes
- Liste os cenários de sucesso e falha.
- Identifique os dados e dependências necessários.
- Verifique se já existem seeds reutilizáveis ou se será necessário criar novas.

### 3. Implemente as Seeds
- Crie arquivos em `tests/integration/config/seeds/`.
- Use *use cases reais* para popular os dados — nunca insira direto no banco.
- Parametrize as seeds para facilitar a reutilização entre testes.

### 4. Desenvolva os Testes de Integração
- Crie o arquivo no padrão: `<NomeDoUseCase>.test.ts`.
- Configure o ambiente de teste (uso de `beforeAll`, `beforeEach`, `afterAll`).
- Implemente testes para cobrir os cenários planejados (sucesso e erro).
- Use `expect(...)` para validar resultados e regras de negócio.

### 5. Execute e Valide
- Rode os testes com `npm run test:integration`.
- Verifique se todos os cenários foram cobertos.
- Garanta que o comportamento da aplicação está conforme as regras definidas.

---

### 🎯 Foco dos Testes de Integração

O objetivo é validar a aplicação **como um sistema em funcionamento**, garantindo:
- Que todas as camadas estão corretamente conectadas.
- Que os dados fluem de forma consistente entre entradas (DTOs), lógicas de negócio e persistência.
- Que erros esperados são tratados e retornados corretamente.

## 📦 Estrutura dos Testes

Todos os testes de integração seguem a seguinte estrutura:

```
tests/
 └── integration/
     ├── config/
     |    └── seeds/         # Funções para gerar dados de teste
     |    └── setup/         # Configuração do ambiente de teste
     ├── application/<nome-da-entidade>/ # Pasta para entidade (ex: measures, station)
          └── <nome-do-usecase>.test.ts
```

### Detalhamento dos Diretórios:

- `config/seeds/`: Contém funções que preparam os dados necessários para os testes. Cada seed deve utilizar os *use cases* reais do sistema para criar os dados.
- `config/setup/`: Possui arquivos para inicialização do banco de dados de teste, limpeza entre os testes e configuração do ambiente.
- `application/<nome-da-entidade>/`: Diretórios organizados por domínio (ex: measures, station, parameters).
- `*.test.ts`: Arquivos com os testes de integração, nomeados conforme o use case testado.


## 🧪 Passo a Passo para Criar um Novo Teste de Integração

### 1. Identificar o Use Case a ser Testado

Primeiro, identifique claramente qual *use case* você precisa testar. Verifique no Jira os critérios de aceitação e regras de negócio relacionadas.

### 2. Criar o Arquivo de Teste na Pasta Correta

O nome do arquivo de teste deve seguir o padrão:  
`<NomeDoUseCase>.test.ts`  

Exemplo: Para testar a criação de medições, crie o arquivo:
`tests/integration/application/measures/CreateMeasureUseCase.test.ts`

### 3. Estrutura Base do Arquivo de Teste

```ts
import { DataSource } from "typeorm";
import SetupIntegration, { getDataSource } from "../config/setup/SetupIntegration";
import { clearDatabase } from "../config/setup/DatabaseCleaner";

// Importar os repositórios e use cases necessários
import { NomeDoUseCase } from "../../../src/application/use-cases/pasta/NomeDoUseCase";
import { NomeDoRepositorio } from "../../../src/infrastructure/repositories/NomeDoRepositorio";

// Declarar variáveis que serão utilizadas nos testes
let dataSource: DataSource;
let useCase: NomeDoUseCase;
let repositorio: NomeDoRepositorio;

// Configurar o ambiente antes de todos os testes
beforeAll(async () => {
  await SetupIntegration();
  dataSource = getDataSource();
});

// Limpar o banco e configurar as instâncias antes de cada teste
beforeEach(async () => {
  await clearDatabase(dataSource);
  repositorio = new NomeDoRepositorio();
  useCase = new NomeDoUseCase(repositorio);
  // Inicialize outros repositórios ou dependências necessárias
});

// Limpar recursos após todos os testes
afterAll(async () => {
  await dataSource.destroy();
});

// Exemplo de teste bem-sucedido
test('✅ Deve executar com sucesso o caso de uso', async () => {
  // Preparar os dados utilizando seeds
  // Executar o caso de uso
  // Verificar os resultados com expects
});

// Exemplo de teste de erro
test('❌ Deve retornar erro quando [condição de erro]', async () => {
  // Preparar o cenário de erro
  // Verificar se o erro é lançado corretamente
  await expect(
    // Chamada do use case com parâmetros que devem gerar erro
  ).rejects.toThrow("Mensagem de erro esperada");
});
```

## 🌱 Como Criar e Utilizar Seeds

As seeds são fundamentais para preparar o ambiente de teste com dados consistentes. Sempre crie os dados utilizando os *use cases* reais, nunca inserindo diretamente no banco.

### Estrutura de uma Seed:

```ts
// config/seeds/createNomeEntidadeSeed.ts
import { UseCase } from "../../../src/application/use-cases/pasta/UseCase";
import { Repositorio } from "../../../src/infrastructure/repositories/Repositorio";
import { DTO } from "../../../src/web/dtos/pasta/DTO";

export async function createNomeEntidadeSeed(parametro1: string, parametro2: number) {
  // Instanciar o use case e repositórios necessários
  const useCase = new UseCase(new Repositorio());
  
  // Criar o DTO com os dados de teste
  const dto = new DTO(parametro1, parametro2);
  
  // Executar o use case e retornar a entidade criada
  return await useCase.execute(dto);
}
```


## 🖥️ Testes de Integração no Front-end

### 📌 Definição e Propósito

No contexto do front-end, os testes de integração validam como os diferentes componentes da interface trabalham juntos, incluindo a integração com serviços de API (que são normalmente simulados). Estes testes visam garantir que:

- Múltiplos componentes React funcionem corretamente juntos
- A navegação entre rotas funcione conforme esperado
- Os contextos (como autenticação) sejam corretamente compartilhados
- As interações do usuário resultem no comportamento esperado
- Os dados sejam exibidos corretamente após operações de API

### 📦 Estrutura dos Testes Front-end

Os testes de integração no front-end seguem uma estrutura organizada por funcionalidade:

```
src/
 └── pages/
     └── NomeDaFuncionalidade/
         └── NomeDoComponente/
             └── NomeDoComponente.int.test.tsx
```

### 📋 Convenções de Nomenclatura

Para facilitar a identificação dos diferentes tipos de teste, utilizamos o sufixo `.int.test.tsx` para testes de integração, distinguindo-os dos testes unitários (`.unit.test.tsx`).

### 🛠️ Passo a Passo para Criar um Teste de Integração no Front-end

#### 1. Criar o Arquivo de Teste

Crie um arquivo seguindo o padrão de nomenclatura na pasta do componente:
```
src/pages/NomeDaFuncionalidade/NomeDoComponente/NomeDoComponente.int.test.tsx
```

#### 2. Estrutura Básica do Teste

```tsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import nomeDoServico from '../../../api/nomeDoServico';
import NomeDoComponente from './NomeDoComponente';
import { AlgumContexto } from '../../../contexts/contexto/AlgumContexto';

// Mock de navegação
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock da API
jest.mock('../../../api/nomeDoServico');

// Dados mock para testes
const dadosMock = [
  // Dados de exemplo para uso nos testes
];

// Função auxiliar para renderizar com contextos necessários
const renderComContexto = (component) => {
  return render(
    <AlgumContexto.Provider value={/* valores do contexto */}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </AlgumContexto.Provider>
  );
};

describe('NomeDoComponente - Integração', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Configuração dos mocks para simular respostas da API
    (nomeDoServico.metodoApi as jest.Mock).mockResolvedValue({
      data: { model: dadosMock },
    });
  });

  test('📋 Deve renderizar os dados após carregamento', async () => {
    renderComContexto(<NomeDoComponente />);
    
    // Aguardar carregamento e verificar elementos na tela
    await waitFor(() => {
      expect(screen.getByText("Texto esperado")).toBeInTheDocument();
    });
  });

  test('🖱️ Deve executar ação correta ao clicar no botão', async () => {
    renderComContexto(<NomeDoComponente />);
    
    // Encontrar e interagir com elementos
    const botao = screen.getByText('Ação');
    fireEvent.click(botao);
    
    // Verificar resultados da interação
    await waitFor(() => {
      expect(nomeDoServico.metodoApi).toHaveBeenCalledWith(expect.any(Object));
      expect(screen.getByText("Resultado esperado")).toBeInTheDocument();
    });
  });
});
```

## 🎯 Práticas Recomendadas para Testes Front-end

1. **Simular o ambiente completo**:
   - Renderizar componentes com todos os contextos e providers necessários
   - Configurar corretamente o Router para simular navegação
   - Criar mocks realistas de APIs e serviços

2. **Focar em interações do usuário**:
   - Testar cliques, preenchimento de formulários e submissões
   - Verificar feedbacks visuais (mensagens de sucesso, erro)
   - Simular o caminho completo que o usuário percorreria

3. **Validar o comportamento, não a implementação**:
   - Verificar o que o usuário veria na tela
   - Confirmar que as ações levam aos resultados corretos
   - Evitar testar detalhes internos de implementação

4. **Usar data-testid para elementos dinâmicos**:
   - Adicionar atributos `data-testid` em elementos importantes
   - Evitar seletores frágeis como índices de arrays
   - Facilitar testes estáveis mesmo com mudanças no layout

5. **Limpar mocks entre testes**:
   - Usar `jest.clearAllMocks()` no `beforeEach`
   - Garantir isolamento dos testes
   - Evitar comportamentos inesperados por estado residual

## ⚙️ Configuração do Ambiente de Testes

### Arquivos de Configuração:

- **SetupIntegration.ts**: Inicializa o TypeORM com o banco de dados de teste. 
- **DatabaseCleaner.ts**: Limpa todas as tabelas do banco entre os testes.
- **TeardownIntegration.ts**: Encerra as conexões após os testes.

### Executando os Testes:

```bash
# Executa todos os testes de integração back-end
npm run test:integration

# Executa todos os testes de integração front-end
npm run test:integration  # No diretório do projeto front-end
```

### 📚 Versões das Bibliotecas

Para garantir a compatibilidade e funcionamento correto dos testes, utilize as seguintes versões das bibliotecas principais:

#### Back-end
```json
{
  "dependencies": {
    "typeorm": "^0.3.20",
    "pg": "^8.11.3",
    "testcontainers": "^10.0.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.12",
    "ts-jest": "^29.1.2"
  }
}
```

#### Front-end
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "ts-jest": "^29.3.2",
    "@types/jest": "^29.5.14"
  }
}
```



### ⚙️ Configuração do jest

#### Back-end
```ts
module.exports = {
    testMatch: [
        "**/tests/integration/*.test.ts",
        "**/tests/integration/**/*.test.ts",
        "**/tests/integration/**/**/*.test.ts",
      ],
    testPathIgnorePatterns: ["/node_modules/"],
    coverageDirectory: "coverage/integration",
    coverageReporters: ["text", "lcov"],
    collectCoverage: true,
    testEnvironment: "node",
    moduleNameMapper: {
      "^@/(.)$": "<rootDir>/src/$1",
    },
    preset: "ts-jest",
    globalSetup: './tests/integration/config/setup/SetupIntegration.ts',
    globalTeardown: './tests/integration/config/setup/TeardownIntegration.ts',
    testTimeout: 60000,
  };
```

#### Front-end
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
```

## ✅ Checklist de Qualidade

Antes de finalizar sua implementação de testes, verifique:

### Back-end
- [ ] Os testes cobrem todos os cenários definidos nos critérios de aceitação
- [ ] Os dados são preparados via seeds usando use cases reais
- [ ] Existem testes para todos os casos de erro relevantes
- [ ] O banco de dados é limpo corretamente entre os testes
- [ ] As mensagens de erro esperadas estão sendo validadas
- [ ] A cobertura de código está adequada (>80%)

### Front-end
- [ ] Os componentes são renderizados com todos os contextos necessários
- [ ] As interações do usuário (cliques, formulários) são testados
- [ ] Os serviços de API são adequadamente mockados
- [ ] A navegação entre páginas é verificada quando relevante
- [ ] Estados de carregamento, sucesso e erro são testados
- [ ] Elementos visuais importantes são verificados

---

**Com testes de integração bem estruturados tanto no back-end quanto no front-end, garantimos que o sistema funciona corretamente como um todo, reduzindo riscos em produção e aumentando a confiança no código.**