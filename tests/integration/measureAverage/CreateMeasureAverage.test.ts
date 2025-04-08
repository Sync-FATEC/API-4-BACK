import { CreateMeasureAverageUseCase } from '../../../src/application/use-cases/measureAverage/CreateMeasureAverageUseCase';
import { IMeasureAverageRepository } from '../../../src/domain/interfaces/repositories/IMeasureAverageRepository';
import { IMeasureRepository } from '../../../src/domain/interfaces/repositories/IMeasureRepository';
import { MeasureAverage } from '../../../src/domain/models/entities/MeasureAverage';
import { enumAverage } from '../../../src/domain/enums/MeasureAverage/enumAverage';
import { Station } from '../../../src/domain/models/entities/Station';

// Mockando a inicialização do banco de dados para evitar erros nos testes
jest.mock('../../../src/infrastructure/database/initialize', () => ({
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
}));

// Mockando o AppDataSource
jest.mock('../../../src/infrastructure/database/data-source', () => {
  const mockRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    create: jest.fn().mockImplementation((entity) => entity),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  return {
    AppDataSource: {
      initialize: jest.fn().mockResolvedValue({}),
      getRepository: jest.fn().mockReturnValue(mockRepository),
    },
  };
});

let mockMeasureAverageRepository: IMeasureAverageRepository;
let mockMeasureRepository: IMeasureRepository;
let createMeasureAverageUseCase: CreateMeasureAverageUseCase;

// Função auxiliar para criar mock de MeasureAverage
function createMockMeasureAverage(id: string, typeAverage: enumAverage, name: string, value: string): MeasureAverage {
  const measureAverage = new MeasureAverage();
  measureAverage.id = id;
  measureAverage.typeAverage = typeAverage;
  measureAverage.name = name;
  measureAverage.value = value;
  measureAverage.createdAt = new Date();
  
  const station = new Station();
  station.id = '123e4567-e89b-12d3-a456-426614174000';
  measureAverage.stationId = station;
  
  return measureAverage;
}

// Função auxiliar para criar mock de medidas
function createMockMeasures() {
  const station = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Estação Teste'
  };
  
  const temperatureParameter = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Temperatura',
    idStation: station,
    idTypeParameter: {
      id: '123e4567-e89b-12d3-a456-426614174002',
      name: 'Temperatura'
    }
  };
  
  const humidityParameter = {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Umidade',
    idStation: station,
    idTypeParameter: {
      id: '123e4567-e89b-12d3-a456-426614174004',
      name: 'Umidade'
    }
  };
  
  return [
    { id: '1', value: 25.0, parameter: temperatureParameter, createdAt: new Date() },
    { id: '2', value: 26.0, parameter: temperatureParameter, createdAt: new Date() },
    { id: '3', value: 65.0, parameter: humidityParameter, createdAt: new Date() },
    { id: '4', value: 66.0, parameter: humidityParameter, createdAt: new Date() }
  ];
}

beforeEach(() => {
  // Mock dos repositórios
  mockMeasureAverageRepository = {
    createMeasureAverage: jest.fn().mockImplementation((measureAverage) => {
      return Promise.resolve({
        ...measureAverage,
        id: '123e4567-e89b-12d3-a456-426614174099'
      });
    }),
    getById: jest.fn(),
    listMeasuresAverages: jest.fn(),
    deleteMeasureAverage: jest.fn()
  };
  
  mockMeasureRepository = {
    createMeasure: jest.fn(),
    getById: jest.fn(),
    listMeasures: jest.fn(),
    deleteMeasure: jest.fn(),
    updateMeasure: jest.fn(),
    listMeasuresLastHour: jest.fn(),
    listMeasuresLastDay: jest.fn()
  };
  
  // Instancia o CreateMeasureAverageUseCase com os repositórios mockados
  createMeasureAverageUseCase = new CreateMeasureAverageUseCase(
    mockMeasureAverageRepository,
    mockMeasureRepository
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Testes de Integração para CreateMeasureAverageUseCase', () => {
  test('✅ Deve calcular e salvar médias por hora corretamente', async () => {
    // Arrange
    const mockMeasures = createMockMeasures();
    mockMeasureRepository.listMeasuresLastHour = jest.fn().mockResolvedValue(mockMeasures);
    
    // Act
    const result = await createMeasureAverageUseCase.executeLastHour();
    
    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(mockMeasureRepository.listMeasuresLastHour).toHaveBeenCalledTimes(1);
    expect(mockMeasureAverageRepository.createMeasureAverage).toHaveBeenCalledTimes(2); // Uma vez para temperatura e uma para umidade
    
    // Verifica se as médias foram calculadas corretamente
    const createCalls = (mockMeasureAverageRepository.createMeasureAverage as jest.Mock).mock.calls;
    
    // Verifica a chamada para temperatura
    const tempCall = createCalls.find(call => call[0].name.includes('Temperatura'));
    expect(tempCall).toBeDefined();
    expect(tempCall[0].typeAverage).toBe(enumAverage.HOUR);
    expect(parseFloat(tempCall[0].value)).toBeCloseTo(25.5, 1); // Média de 25.0 e 26.0
    
    // Verifica a chamada para umidade
    const humidityCall = createCalls.find(call => call[0].name.includes('Umidade'));
    expect(humidityCall).toBeDefined();
    expect(humidityCall[0].typeAverage).toBe(enumAverage.HOUR);
    expect(parseFloat(humidityCall[0].value)).toBeCloseTo(65.5, 1); // Média de 65.0 e 66.0
  });
  
  test('✅ Deve calcular e salvar médias por dia corretamente', async () => {
    // Arrange
    const mockMeasures = createMockMeasures();
    mockMeasureRepository.listMeasuresLastDay = jest.fn().mockResolvedValue(mockMeasures);
    
    // Act
    const result = await createMeasureAverageUseCase.executeLastDay();
    
    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(mockMeasureRepository.listMeasuresLastDay).toHaveBeenCalledTimes(1);
    expect(mockMeasureAverageRepository.createMeasureAverage).toHaveBeenCalledTimes(2); // Uma vez para temperatura e uma para umidade
    
    // Verifica se as médias foram calculadas corretamente
    const createCalls = (mockMeasureAverageRepository.createMeasureAverage as jest.Mock).mock.calls;
    
    // Verifica a chamada para temperatura
    const tempCall = createCalls.find(call => call[0].name.includes('Temperatura'));
    expect(tempCall).toBeDefined();
    expect(tempCall[0].typeAverage).toBe(enumAverage.DAY);
    expect(parseFloat(tempCall[0].value)).toBeCloseTo(25.5, 1); // Média de 25.0 e 26.0
    
    // Verifica a chamada para umidade
    const humidityCall = createCalls.find(call => call[0].name.includes('Umidade'));
    expect(humidityCall).toBeDefined();
    expect(humidityCall[0].typeAverage).toBe(enumAverage.DAY);
    expect(parseFloat(humidityCall[0].value)).toBeCloseTo(65.5, 1); // Média de 65.0 e 66.0
  });
  
  test('❌ Deve lidar corretamente quando não há medidas para calcular médias por hora', async () => {
    // Arrange
    mockMeasureRepository.listMeasuresLastHour = jest.fn().mockResolvedValue([]);
    
    // Act
    const result = await createMeasureAverageUseCase.executeLastHour();
    
    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(mockMeasureRepository.listMeasuresLastHour).toHaveBeenCalledTimes(1);
    expect(mockMeasureAverageRepository.createMeasureAverage).not.toHaveBeenCalled();
  });
  
  test('❌ Deve lidar corretamente quando não há medidas para calcular médias por dia', async () => {
    // Arrange
    mockMeasureRepository.listMeasuresLastDay = jest.fn().mockResolvedValue([]);
    
    // Act
    const result = await createMeasureAverageUseCase.executeLastDay();
    
    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(mockMeasureRepository.listMeasuresLastDay).toHaveBeenCalledTimes(1);
    expect(mockMeasureAverageRepository.createMeasureAverage).not.toHaveBeenCalled();
  });
});