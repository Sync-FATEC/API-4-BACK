# 📘 Documentação de Testes de Integração

## 🔍 O que são Testes de Integração?

Os testes de integração validam a interação entre múltiplos componentes ou camadas do sistema. Diferente dos testes unitários, que testam funções isoladas, os testes de integração verificam como diferentes partes do sistema trabalham juntas. No nosso contexto, validamos principalmente:

- A interação entre *use cases* e repositórios
- O fluxo completo de dados entre a aplicação e o banco de dados
- A execução das regras de negócio de ponta a ponta

---

## 📦 Estrutura dos Testes

Todos os testes de integração seguem a seguinte estrutura:

```
tests/
 └── integration/
     ├── config/
     |    └── seeds/         # Funções para gerar dados de teste
     |    └── setup/         # Configuração do ambiente de teste
     ├── <nome-da-entidade>/ # Pasta para entidade (ex: measures, station)
          └── <nome-do-usecase>.test.ts
```

### Detalhamento dos Diretórios:

- `config/seeds/`: Contém funções que preparam os dados necessários para os testes. Cada seed deve utilizar os *use cases* reais do sistema para criar os dados.
- `config/setup/`: Possui arquivos para inicialização do banco de dados de teste, limpeza entre os testes e configuração do ambiente.
- `<nome-da-entidade>/`: Diretórios organizados por domínio (ex: measures, station, parameters).
- `*.test.ts`: Arquivos com os testes de integração, nomeados conforme o use case testado.

---

## 🧪 Passo a Passo para Criar um Novo Teste de Integração

### 1. Identificar o Use Case a ser Testado

Primeiro, identifique claramente qual *use case* você precisa testar. Verifique no Jira os critérios de aceitação e regras de negócio relacionadas.

### 2. Criar o Arquivo de Teste na Pasta Correta

O nome do arquivo de teste deve seguir o padrão:  
`<NomeDoUseCase>.test.ts`  

Exemplo: Para testar a criação de medições, crie o arquivo:
`tests/integration/measures/CreateMeasureUseCase.test.ts`

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

---

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

### Exemplo Real de Seed para Estação:

```ts
// createStationSeed.ts
import { CreateStationUseCase } from "../../../src/application/use-cases/station/CreateStationUseCase";
import StationRepository from "../../../src/infrastructure/repositories/StationRepository";
import CreateStationDTO from "../../../src/web/dtos/station/CreateStationDTO";

export async function createStationSeed() {
  const useCase = new CreateStationUseCase(new StationRepository());
  const dto = new CreateStationDTO("Estação Centro", "uuid-centro", "-23.5505", "-46.6333");
  return await useCase.execute(dto);
}
```

### Utilizando Seeds nos Testes:

```ts
test('✅ Deve criar uma medição', async () => {
  // Criação dos dados necessários usando seeds
  const station = await createStationSeed();
  const typeParameter = await createTypeParameterSeed();
  const parameter = await createParameterSeed(typeParameter, station);
  
  // Executar o caso de uso a ser testado
  const measure = await createMeasuresSeed(parameter.id);

  // Validação dos resultados
  expect(measure).toBeDefined();
  expect(measure.parameter.id).toBe(parameter.id);
  expect(measure.parameter.idTypeParameter).toEqual(typeParameter);
  expect(measure.parameter.idStation).toEqual(station);
});
```

---

## 🧑‍💻 Fluxo Completo para o Desenvolvedor

1. **Analise os requisitos:**
   - Consulte o Jira para entender a funcionalidade
   - Identifique os critérios de aceitação e regras de negócio
   - Mapeie os *use cases* envolvidos

2. **Planeje os testes:**
   - Identifique cenários de sucesso e falha
   - Liste as dependências e dados necessários
   - Verifique quais seeds precisará criar ou reutilizar

3. **Implemente as seeds necessárias:**
   - Crie arquivos em `config/seeds/` para cada tipo de dado
   - Utilize os *use cases* reais para criar os dados
   - Parametrize as seeds para permitir flexibilidade

4. **Desenvolva os testes de integração:**
   - Crie o arquivo no formato `<NomeDoUseCase>.test.ts`
   - Implemente a configuração básica (beforeAll, beforeEach, afterAll)
   - Implemente testes para cenários de sucesso e falha
   - Utilize assertions específicas para validar o comportamento

5. **Execute e valide os testes:**
   - Execute os testes usando `npm run test:integration`
   - Verifique se todos os cenários estão cobertos
   - Confirme que as regras de negócio estão sendo validadas

---

## 🧾 Exemplo Completo de Teste de Integração

```ts
// CreateMeasureUseCase.test.ts
import { DataSource } from "typeorm";
import { RegisterMeasureUseCase } from "../../../src/application/use-cases/measure/RegisterMeasureUseCase";
import { MeasureRepository } from "../../../src/infrastructure/repositories/MeasureRepository";
import { ParameterRepository } from "../../../src/infrastructure/repositories/ParameterRepository";
import StationRepository from "../../../src/infrastructure/repositories/StationRepository";
import SetupIntegration, { getDataSource } from "../config/setup/SetupIntegration";
import { clearDatabase } from "../config/setup/DatabaseCleaner";
import { createParameterSeed } from "../config/seeds/createParameterSeed";
import { createStationSeed } from "../config/seeds/createStationSeed";
import { createTypeParameterSeed } from "../config/seeds/createTypeParameterSeed";
import { createMeasuresSeed } from "../config/seeds/createMeasuresSeed";

let dataSource: DataSource;
let useCase: RegisterMeasureUseCase;
let measureRepo: MeasureRepository;
let parameterRepo: ParameterRepository;
let stationRepo: StationRepository;

beforeAll(async () => {
    await SetupIntegration();
    dataSource = getDataSource();
});

beforeEach(async () => {
    await clearDatabase(dataSource);
    measureRepo = new MeasureRepository();
    parameterRepo = new ParameterRepository();
    stationRepo = new StationRepository();
    useCase = new RegisterMeasureUseCase(measureRepo, parameterRepo, stationRepo);
});

afterAll(async () => {
    await dataSource.destroy();
});

// Cenário de sucesso
test('✅ Deve criar uma medição', async () => {
    const station = await createStationSeed();
    const typeParameter = await createTypeParameterSeed();
    const parameter = await createParameterSeed(typeParameter, station);
    const measure = await createMeasuresSeed(parameter.id);
    
    expect(measure).toBeDefined();
    expect(measure.parameter.id).toBe(parameter.id);
    expect(measure.parameter.idTypeParameter).toEqual(typeParameter);
    expect(measure.parameter.idStation).toEqual(station);
    expect(measure.parameter.idTypeParameter.name).toBe(typeParameter.name);
    expect(measure.unixTime).toBe(measure.unixTime);
    expect(measure.value).toBe(measure.value);
});

// Cenário de erro
test('❌ Deve retornar um erro ao criar uma medição com um parâmetro não existente', async () => {
    await expect(
        createMeasuresSeed('2bc8680a-8ecf-46db-bc63-90a0925eb66b')
    ).rejects.toThrow("Parametro não encontrado");
});
```

---

## ⚙️ Configuração do Ambiente de Testes

### Arquivos de Configuração:

- **SetupIntegration.ts**: Inicializa o TypeORM com o banco de dados de teste. 
- **DatabaseCleaner.ts**: Limpa todas as tabelas do banco entre os testes.
- **TeardownIntegration.ts**: Encerra as conexões após os testes.

### Executando os Testes:

```bash
# Executa todos os testes de integração
npm run test:integration
```

### 📚 Versões das Bibliotecas

Para garantir a compatibilidade e funcionamento correto dos testes, utilize as seguintes versões das bibliotecas principais:

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

---

## 🎯 Práticas Recomendadas

1. **Dados consistentes**:
   - Sempre use seeds para criar dados de teste
   - Nunca faça manipulação direta do banco
   - Mantenha os dados realistas

2. **Nomeação clara**:
   - Testes com nomes descritivos indicando o cenário
   - Prefixo "✅" para testes de sucesso
   - Prefixo "❌" para testes de falha

3. **Validações completas**:
   - Teste todas as propriedades relevantes
   - Valide casos de borda e exceções
   - Verifique mensagens de erro específicas

4. **Isolamento**:
   - Cada teste deve ser independente
   - O banco deve ser limpo entre cada teste
   - Evite dependências entre testes

---

## ✅ Checklist de Qualidade

Antes de finalizar sua implementação de testes, verifique:

- [ ] Os testes cobrem todos os cenários definidos nos critérios de aceitação
- [ ] Os dados são preparados via seeds usando use cases reais
- [ ] Existem testes para todos os casos de erro relevantes
- [ ] O banco de dados é limpo corretamente entre os testes
- [ ] As mensagens de erro esperadas estão sendo validadas
- [ ] A cobertura de código está adequada (>80%)
- [ ] Os testes são legíveis e bem documentados

---

**Com testes de integração bem estruturados, garantimos que o sistema funciona corretamente como um todo, reduzindo riscos em produção e aumentando a confiança no código.**

