import request from 'supertest';
import { app, startServer } from '../../../../src/server';
import ListMeasureAverageUseCase from '../../../../src/application/use-cases/measureAverage/ListMeasureAverageUseCase';
import { Request, Response, NextFunction } from 'express';
import { IMeasureAverageRepository } from '../../../../src/domain/interfaces/repositories/IMeasureAverageRepository';
import { MeasureAverage } from '../../../../src/domain/models/entities/MeasureAverage';
import { enumAverage } from '../../../../src/domain/enums/MeasureAverage/enumAverage';

// Mockando a inicialização do banco de dados para evitar erros nos testes
jest.mock('../../../../src/infrastructure/database/initialize', () => ({
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
}));

// Mockando o AppDataSource
jest.mock('../../../../src/infrastructure/database/data-source', () => {
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

let currentMockRepository: IMeasureAverageRepository;

// Mock do repositório
jest.mock('../../../../src/domain/interfaces/repositories/IMeasureAverageRepository', () => ({
  IMeasureAverageRepository: jest.fn()
}));

// Mock do ListMeasureAverageController
jest.mock('../../../../src/web/controllers/MeasureAverage/ListMeasureAverageController', () => ({
  ListMeasureAverageController: jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockImplementation(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const useCase = new ListMeasureAverageUseCase(currentMockRepository);
        const stationId = req.params.stationId;
        const measures = await useCase.execute(stationId);
        return res.sendSuccess(measures, 200);
      } catch (error) {
        next(error);
      }
    }),
  })),
}));

beforeEach(() => {
  // Mock do repositório
  currentMockRepository = {
    createMeasureAverage: jest.fn(),
    getById: jest.fn(),
    listMeasuresAverages: jest.fn(),
    deleteMeasureAverage: jest.fn()
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Testes de Integração para listar médias de medidas - /measureAverage/:stationId', () => {
  test('✅ Deve retornar status 200 e lista de médias de medidas', async () => {
    const stationId = '123e4567-e89b-12d3-a456-426614174000';
    
    const mockMeasureAverages = [
      createMockMeasureAverage('1', enumAverage.DAY, 'Estação teste - Temperatura', '25.5'),
      createMockMeasureAverage('2', enumAverage.HOUR, 'Estação teste - Umidade', '65.3')
    ];

    currentMockRepository.listMeasuresAverages = jest.fn().mockResolvedValue(mockMeasureAverages);

    const response = await request(app).get(`/measureAverage/${stationId}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(Array.isArray(response.body.model)).toBe(true);
    expect(response.body.model.length).toBe(2);
    expect(response.body.model[0].id).toBe('1');
    expect(response.body.model[0].typeAverage).toBe(enumAverage.DAY);
    expect(response.body.model[0].name).toBe('Estação teste - Temperatura');
    expect(response.body.model[0].value).toBe('25.5');
  });

  test('❌ Deve retornar status 400 caso não existam médias de medidas', async () => {
    const stationId = '123e4567-e89b-12d3-a456-426614174000';
    
    currentMockRepository.listMeasuresAverages = jest.fn().mockResolvedValue(null);

    const response = await request(app).get(`/measureAverage/${stationId}`);
    
    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.model).toBeNull();
    expect(response.body.error).toBe("Nenhuma media de medida para listar");
  });
});

// Função auxiliar para criar um mock de MeasureAverage
function createMockMeasureAverage(id: string, typeAverage: enumAverage, name: string, value: string): MeasureAverage {
  const measureAverage = new MeasureAverage();
  measureAverage.id = id;
  measureAverage.typeAverage = typeAverage;
  measureAverage.name = name;
  measureAverage.value = value;
  measureAverage.createdAt = new Date();
  return measureAverage;
}