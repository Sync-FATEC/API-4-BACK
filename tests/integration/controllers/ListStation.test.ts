import request from 'supertest';
import { app, startServer } from '../../../src/server';
import { ListStationUseCase } from '../../../src/application/use-cases/station/ListStationUseCase';
import { Request, Response, NextFunction } from 'express';
import { IStationRepository } from '../../../src/domain/interfaces/repositories/IStationRepository';

let currentMockRepository: IStationRepository;

let serverInstance: any;

// Mock do repositório
jest.mock('../../../src/domain/interfaces/repositories/IStationRepository', () => ({
  IStationRepository: jest.fn()
}));

// Mock do ListStationController
jest.mock('../../../src/web/controllers/station/ListStationController', () => ({
  ListStationController: jest.fn().mockImplementation(() => ({
    handle: jest.fn().mockImplementation(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const useCase = new ListStationUseCase(currentMockRepository);
        const stations = await useCase.execute();
        return res.sendSuccess(stations, 200);
      } catch (error) {
        next(error);
      }
    }),
  })),
}));

beforeAll(async () => {
  serverInstance = await startServer(String(5001));
});

beforeEach(() => {
  // Mock do repositório
  currentMockRepository = {
    list: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    listWithParameters: jest.fn(),
    findById: jest.fn(),
    findByUuid: jest.fn()
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  serverInstance.close();
});

describe('Testes de Integração - /station/list', () => {
  test('✅ Deve retornar status 200 e lista de estações', async () => {
    const mockStations = [
      {
        id: '987f6543-b21c-34d5-e678-123456789abc',
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Estação Teste',
        latitude: -23.55052,
        longitude: -46.633308,
        description: 'Descrição da estação de teste',
      },
    ];

    currentMockRepository.list = jest.fn().mockResolvedValue(mockStations);

    const response = await request(app).get('/station/list');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(Array.isArray(response.body.model)).toBe(true);
    expect(response.body.model.length).toBeGreaterThan(0);
    expect(response.body.model[0].id).toBe('987f6543-b21c-34d5-e678-123456789abc');
    expect(response.body.model[0].uuid).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(response.body.model[0].name).toBe('Estação Teste');
    expect(response.body.model[0].latitude).toBe(-23.55052);
    expect(response.body.model[0].longitude).toBe(-46.633308);
    expect(response.body.model[0].description).toBe('Descrição da estação de teste');

  });

  test('❌ Deve retornar status 400 caso a lista esteja vazia', async () => {
    currentMockRepository.list = jest.fn().mockResolvedValue([]);

    const response = await request(app).get('/station/list');
    
    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.model).toBeNull();
    expect(response.body.error).toBe("Nenhuma estação para listar");
  });
});
