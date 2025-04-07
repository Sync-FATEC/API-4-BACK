import request from 'supertest';
import { app, startServer } from '../../../../src/server';
import { ListStationUseCase } from '../../../../src/application/use-cases/station/ListStationUseCase';
import { Request, Response, NextFunction } from 'express';
import { IStationRepository } from '../../../../src/domain/interfaces/repositories/IStationRepository';
import { sign } from 'jsonwebtoken';

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

let currentMockRepository: IStationRepository;

let serverInstance: any;

// Mock do repositório
jest.mock('../../../../src/domain/interfaces/repositories/IStationRepository', () => ({
    IStationRepository: jest.fn()
}));

// Mock do ListStationController
jest.mock('../../../../src/web/controllers/station/ListStationController', () => ({
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


describe('Testes de Integração para criar estação - /station/create', () => {
    test('✅ Deve retornar status 200 e a estações criada', async () => {
        const mockStations = {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Estação Teste',
            latitude: -23.55052,
            longitude: -46.633308,
            description: 'Descrição da estação de teste',
        }

        currentMockRepository.create = jest.fn().mockResolvedValue(mockStations);

        const token = sign(
            {
                id: '1',
                name: 'admin',
                email: 'admin@admin.com',
                role: 'ADMIN'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        const response = await request(app)
            .post('/station/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                uuid: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Estação Teste',
                latitude: -23.55052,
                longitude: -46.633308,
                description: 'Descrição da estação de teste',
            });
            
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(200);
        expect(response.body.model).toBeDefined();
        expect(response.body.model.name).toBe('Estação Teste');
        expect(response.body.model.uuid).toBe('123e4567-e89b-12d3-a456-426614174000');
        expect(response.body.model.latitude).toBe(-23.55052);
        expect(response.body.model.longitude).toBe(-46.633308);
        expect(response.body.model).toHaveProperty('createdAt');

    });

    test('❌ Deve retornar status 404 caso não pase o token', async () => {
        const mockStations = {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Estação Teste',
            latitude: -23.55052,
            longitude: -46.633308,
            description: 'Descrição da estação de teste',
        }

        currentMockRepository.create = jest.fn().mockResolvedValue(mockStations);

        const response = await request(app).get('/station/create');

        expect(response.status).toBe(404);
    });

    test('❌ Deve retornar status 401 caso o token seja inválido', async () => {
        const mockStations = {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Estação Teste',
            latitude: -23.55052,
            longitude: -46.633308,
            description: 'Descrição da estação de teste',
        }

        const token = sign(
            {
                id: '1',
                name: 'admin',
                email: 'admin@admin.com',
                role: 'ADMIN'
            },
            'test_jwt',
            { expiresIn: '1h' }
        );
        
        const response = await request(app)
            .post('/station/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                uuid: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Estação Teste',
                latitude: -23.55052,
                longitude: -46.633308,
                description: 'Descrição da estação de teste',
            });

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(401);
        expect(response.body.model).toBeDefined();
        expect(response.body.error).toBe("Token inválido ou expirado");
    });
});
