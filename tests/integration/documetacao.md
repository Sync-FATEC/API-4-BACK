# 📘 Documentação de Testes de Integração com Jest e TDD

## ✨ Objetivo

Esta documentação tem como objetivo guiar os desenvolvedores na criação de testes de integração utilizando Jest e seguindo a metodologia TDD (Test-Driven Development), baseando-se na estrutura de *use cases* do sistema. O foco está em garantir que as regras de negócio sejam validadas de forma completa, simulando interações reais com o sistema e respeitando a estrutura em camadas.

---

## 🔍 O que são Testes de Integração com TDD?

Os testes de integração validam a interação entre múltiplos componentes ou camadas do sistema. Diferente dos testes unitários, que testam funções isoladas, os testes de integração verificam como diferentes partes do sistema trabalham juntas. No nosso contexto, validamos principalmente:

- A interação entre operações de *use cases* e repositórios
- O fluxo completo de dados entre a aplicação e o banco de dados
- A execução das regras de negócio de ponta a ponta

Em nosso projeto, seguimos o TDD (Test-Driven Development) com uma abordagem específica:

1. **Red**: Os casos de teste já estão escritos e falham por design, pois especificam comportamentos ainda não implementados
2. **Green**: O desenvolvedor implementa o código mínimo necessário para fazer os casos de teste passarem
3. **Refactor**: O desenvolvedor melhora o código mantendo os casos de teste passando

Este documento orienta principalmente as fases GREEN e REFACTOR, já que a fase RED (especificação dos casos de teste) já foi preparada previamente.

---

## 📦 Estrutura dos Testes

Todos os testes de integração seguem a seguinte estrutura:

```
tests/
 └── integration/
     ├── application/
     |    └── <nome-da-entidade>/ # Pasta para entidade (ex: measures, station)
     |         └── <nome-do-usecase>.test.ts
     ├── config/
     |    └── seeds/         # Funções para gerar dados de teste
     |    └── setup/         # Configuração do ambiente de teste
     └── documentacao.md
```

### Detalhamento dos Diretórios:

- `application/<nome-da-entidade>/`: Diretórios organizados por domínio (ex: measures, station, parameters) dentro da camada de aplicação.
- `config/seeds/`: Contém funções que preparam os dados necessários para os testes. Cada seed deve utilizar os *use cases* reais do sistema para criar os dados.
- `config/setup/`: Possui arquivos para inicialização do banco de dados de teste, limpeza entre os testes e configuração do ambiente.
- `*.test.ts`: Arquivos com os casos de teste de integração, nomeados conforme o use case testado.

---

## 🧪 Fluxo de Trabalho com TDD - Casos de Teste Já Escritos

### 1. Compreender os Casos de Teste Existentes (Fase RED já preparada)

Primeiramente, analise os casos de teste já escritos para entender o comportamento esperado do *use case*. Os casos de teste foram criados com base nos critérios de aceitação definidos no Jira e descrevem tanto os cenários de sucesso quanto de falha.

Exemplo de um caso de teste já existente:

```ts
test('✅ Deve criar uma medição', async () => {
  // Precondições - Preparação do cenário de teste
  const station = await createStationSeed();
  const typeParameter = await createTypeParameterSeed();
  const parameter = await createParameterSeed(typeParameter, station);
  
  const dto = new RegisterMeasureDTO(parameter.id, 25.5, Date.now());
  
  // Ação sob teste - Execução da operação a ser implementada
  const measure = await useCase.execute(dto);
  
  // Asserções - Verificação do comportamento esperado
  expect(measure).toBeDefined();
  expect(measure.parameter.id).toBe(parameter.id);
  expect(measure.parameter.idTypeParameter).toEqual(typeParameter);
  expect(measure.parameter.idStation).toEqual(station);
  expect(measure.value).toBe(25.5);
});
```

### 2. Implementar o Código Mínimo (Fase GREEN)

Como desenvolvedor, sua tarefa é criar a implementação mais simples possível que faça os casos de teste passarem:

```ts
// RegisterMeasureUseCase.ts - Sua implementação para fazer o caso de teste passar
export class RegisterMeasureUseCase {
  constructor(
    private measureRepository: MeasureRepository,
    private parameterRepository: ParameterRepository
  ) {}
  
  async execute(dto: RegisterMeasureDTO): Promise<Measure> {
    // 1. Validar precondições - Obter o parâmetro pelo ID
    const parameter = await this.parameterRepository.findById(dto.parameterId);
    if (!parameter) {
      throw new Error("Parametro não encontrado");
    }
    
    // 2. Executar a lógica de negócio - Criar a medição
    const measure = new Measure();
    measure.parameter = parameter;
    measure.value = dto.value;
    measure.unixTime = dto.unixTime;
    
    // 3. Persistir e retornar o resultado
    return await this.measureRepository.save(measure);
  }
}
```

### 3. Refatorar o Código (Fase REFACTOR)

Após fazer os casos de teste passarem, melhore a implementação mantendo os testes em verde:

```ts
// Versão refatorada do RegisterMeasureUseCase.ts
export class RegisterMeasureUseCase {
    constructor(
        private measureRepository: IMeasureRepository,
        private parameterRepository: IParameterRepository
    ) {}
    
    async execute(dto: RegisterMeasureDTO): Promise<Measure> {
        const parameter = await this.validateAndGetParameter(dto.parameterId);
        return await this.createAndSaveMeasure(parameter, dto);
    }
    
    private async validateAndGetParameter(parameterId: string): Promise<Parameter> {
        const parameter = await this.parameterRepository.findById(parameterId);
        if (!parameter) {
            throw new ApplicationError("PARAMETER_NOT_FOUND", "Parametro não encontrado");
        }
        return parameter;
    }
    
    private async createAndSaveMeasure(parameter: Parameter, dto: RegisterMeasureDTO): Promise<Measure> {
        const measure = Measure.create({
            parameter,
            value: dto.value,
            unixTime: dto.unixTime
        });
        
        return await this.measureRepository.save(measure);
    }
}
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

### Utilizando Seeds nas Precondições dos Casos de Teste:

```ts
test('✅ Deve criar uma medição', async () => {
  // Precondições - Criação dos dados necessários usando seeds
  const station = await createStationSeed();
  const typeParameter = await createTypeParameterSeed();
  const parameter = await createParameterSeed(typeParameter, station);
  
  // Ação sob teste - Execução da operação 
  const measure = await createMeasuresSeed(parameter.id);

  // Asserções - Verificação do comportamento esperado
  expect(measure).toBeDefined();
  expect(measure.parameter.id).toBe(parameter.id);
  expect(measure.parameter.idTypeParameter).toEqual(typeParameter);
  expect(measure.parameter.idStation).toEqual(station);
});
```

---

## 🧑‍💻 Fluxo de Trabalho para o Desenvolvedor

1. **Compreender os requisitos e os casos de teste existentes:**
   - Analise os casos de teste já escritos (fase RED)
   - Verifique no Jira os critérios de aceitação e regras de negócio
   - Entenda os cenários de sucesso e falha especificados

2. **Executar os casos de teste para confirmar que eles falham:**
   - Execute `npm run test:integration`
   - Analise os motivos específicos das falhas
   - Compreenda as asserções e comportamentos esperados definidos nos casos de teste

3. **Implementar o código mínimo para passar nos casos de teste (Fase GREEN):**
   - Desenvolva o *use case* com a implementação mais simples possível
   - Foque em satisfazer todos os critérios de aceitação especificados nos casos de teste
   - Implemente apenas o necessário para atender às asserções dos casos de teste

4. **Refatorar o código mantendo os casos de teste passando (Fase REFACTOR):**
   - Melhore a organização, legibilidade e manutenibilidade do código
   - Elimine duplicações e aplique padrões de projeto adequados
   - Execute os casos de teste após cada refatoração para garantir que continuam passando

5. **Validar a completude da implementação:**
   - Confirme que todos os casos de teste estão passando
   - Verifique se todas as regras de negócio foram implementadas
   - Certifique-se de que os casos de erro são tratados conforme as especificações

---

## 🧾 Exemplo Completo do Fluxo de Trabalho

### Casos de Teste Existentes (Fase RED)

```ts
// CreateMeasureUseCase.test.ts - Casos de teste já escritos
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
import RegisterMeasureDTO from "../../../src/web/dtos/measure/RegisterMeasureDTO";

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

// Caso de teste de cenário positivo - Já escrito, aguardando implementação
test('✅ Deve registrar uma medição com valores válidos', async () => {
    // Precondições
    const station = await createStationSeed();
    const typeParameter = await createTypeParameterSeed();
    const parameter = await createParameterSeed(typeParameter, station);
    
    const dto = new RegisterMeasureDTO(parameter.id, 25.5, Date.now());
    
    // Ação sob teste
    const measure = await useCase.execute(dto);
    
    // Asserções
    expect(measure).toBeDefined();
    expect(measure.parameter.id).toBe(parameter.id);
    expect(measure.parameter.idTypeParameter).toEqual(typeParameter);
    expect(measure.parameter.idStation).toEqual(station);
    expect(measure.value).toBe(25.5);
    expect(measure.unixTime).toBe(dto.unixTime);
});

// Caso de teste de cenário negativo - Também já escrito, aguardando implementação
test('❌ Deve rejeitar medição com parâmetro inexistente', async () => {
    // Precondições para cenário de falha
    const invalidParameterId = '2bc8680a-8ecf-46db-bc63-90a0925eb66b';
    const dto = new RegisterMeasureDTO(invalidParameterId, 30.0, Date.now());
    
    // Asserção de comportamento de erro esperado
    await expect(
        useCase.execute(dto)
    ).rejects.toThrow("Parametro não encontrado");
});
```

### Sua Implementação (Fase GREEN)

```ts
// RegisterMeasureUseCase.ts - Implementação que você deve criar
export class RegisterMeasureUseCase {
    constructor(
        private measureRepository: MeasureRepository,
        private parameterRepository: ParameterRepository,
        private stationRepository: StationRepository
    ) {}
    
    async execute(dto: RegisterMeasureDTO): Promise<Measure> {
        // Verificar se o parâmetro existe
        const parameter = await this.parameterRepository.findById(dto.parameterId);
        if (!parameter) {
            throw new Error("Parametro não encontrado");
        }
        
        // Criar a entidade de medição
        const measure = new Measure();
        measure.parameter = parameter;
        measure.value = dto.value;
        measure.unixTime = dto.unixTime;
        
        // Salvar e retornar a medição
        return await this.measureRepository.save(measure);
    }
}
```

### Refatoração (Fase REFACTOR)

```ts
// RegisterMeasureUseCase.ts - Sua implementação refatorada
export class RegisterMeasureUseCase {
    constructor(
        private measureRepository: IMeasureRepository,
        private parameterRepository: IParameterRepository
    ) {}
    
    async execute(dto: RegisterMeasureDTO): Promise<Measure> {
        await this.validateParameter(dto.parameterId);
        return await this.createAndSaveMeasure(dto);
    }
    
    private async validateParameter(parameterId: string): Promise<Parameter> {
        const parameter = await this.parameterRepository.findById(parameterId);
        if (!parameter) {
            throw new ApplicationError("PARAMETER_NOT_FOUND", "Parametro não encontrado");
        }
        return parameter;
    }
    
    private async createAndSaveMeasure(dto: RegisterMeasureDTO): Promise<Measure> {
        const parameter = await this.parameterRepository.findById(dto.parameterId);
        
        const measure = Measure.create({
            parameter,
            value: dto.value,
            unixTime: dto.unixTime
        });
        
        return await this.measureRepository.save(measure);
    }
}
```

---

## ⚙️ Configuração do Ambiente de Testes

### Arquivos de Configuração:

- **SetupIntegration.ts**: Inicializa o TypeORM com o banco de dados de teste. 
- **DatabaseCleaner.ts**: Limpa todas as tabelas do banco entre os testes.
- **TeardownIntegration.ts**: Encerra as conexões após os testes.

### Executando os Casos de Teste:

```bash
# Executa todos os casos de teste de integração
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

1. **Compreenda integralmente os casos de teste:**
   - Analise cuidadosamente os casos de teste existentes antes de implementar
   - Identifique os critérios de aceitação especificados em cada caso de teste
   - Observe as asserções (expects) para entender o comportamento esperado

2. **Implemente apenas o necessário para atender às especificações:**
   - Escreva o código mínimo para fazer os casos de teste passarem
   - Evite adicionar funcionalidades não cobertas por casos de teste
   - Foque nos critérios de aceitação definidos nos casos de teste

3. **Refatore com segurança:**
   - Execute os casos de teste após cada refatoração
   - Mantenha a mesma interface pública do use case
   - Melhore a estrutura interna preservando o comportamento verificado pelos casos de teste

4. **Respeite o contrato definido nos casos de teste:**
   - Implemente as assinaturas de métodos e classes conforme esperado nos casos de teste
   - Trate os erros exatamente como especificado nos casos de teste
   - Garanta que todas as asserções sejam satisfeitas

5. **Utilize as seeds para preparar precondições:**
   - Entenda como as seeds são utilizadas para preparar os cenários de teste
   - Mantenha a consistência com o padrão de seeds existente
   - Trate as seeds como ferramentas para garantir as precondições dos casos de teste

---

## ✅ Checklist de Qualidade

Antes de finalizar sua implementação, verifique:

- [ ] Todos os casos de teste estão passando (fase GREEN concluída)
- [ ] O código foi refatorado para melhor qualidade (fase REFACTOR concluída)
- [ ] A implementação atende a todos os critérios de aceitação especificados nos casos de teste
- [ ] Os cenários de erro são tratados conforme esperado nos casos de teste
- [ ] Não foram adicionadas funcionalidades não cobertas por casos de teste
- [ ] O código segue os padrões e convenções do projeto
- [ ] A implementação é a mais simples possível que satisfaz os casos de teste

---

**Com este fluxo de trabalho, garantimos que o código implementado atenda exatamente às especificações definidas nos casos de teste, resultando em um sistema mais confiável e alinhado com as regras de negócio.**

