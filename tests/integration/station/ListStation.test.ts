import { DataSource } from 'typeorm';
import { ListStationUseCase } from '../../../src/application/use-cases/station/ListStationUseCase';
import StationRepository from '../../../src/infrastructure/repositories/StationRepository';
import { runStationSeeds } from '../seeds/stationSeeds';
import SetupIntegration, { getDataSource } from '../setup/SetupIntegration';
import request from 'supertest';
import { app } from '../../../src/server';

let dataSource: DataSource;
let useCase: ListStationUseCase;
let stationRepository: StationRepository;

beforeAll(async () => {
  await SetupIntegration();
});

beforeEach(async () => {
  dataSource = getDataSource();
  await dataSource.synchronize(true);
  
  // Criar estações de teste usando seeds
  await runStationSeeds(dataSource);
  
  stationRepository = new StationRepository();
  useCase = new ListStationUseCase(stationRepository);
});

describe('Testes de Integração para listar estação - /station/list', () => {
  test('✅ Deve listar todas as estações com banco real', async () => {
    // Executar o caso de uso diretamente
    const stations = await useCase.execute();
    
    // Verificar se retornou as estações corretamente
    expect(stations).toBeDefined();
    expect(stations.length).toBe(3); // 3 estações criadas no seed
    expect(stations[0].name).toBe('Estação Centro');
    expect(stations[1].name).toBe('Estação Norte');
    expect(stations[2].name).toBe('Estação Sul');
  });
  
  test('✅ Deve retornar status 200 e lista de estações via API', async () => {
    const response = await request(app).get('/station/list');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(Array.isArray(response.body.model)).toBe(true);
    expect(response.body.model.length).toBe(3);
    
    // Verificar se as estações estão na resposta
    const stationNames = response.body.model.map((station: any) => station.name);
    expect(stationNames).toContain('Estação Centro');
    expect(stationNames).toContain('Estação Norte');
    expect(stationNames).toContain('Estação Sul');
  });
  
  test('❌ Deve retornar status 400 caso a lista esteja vazia', async () => {
    // Limpar todas as estações do banco
    await dataSource.getRepository('Station').clear();
    
    const response = await request(app).get('/station/list');
    
    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.model).toBeNull();
    expect(response.body.error).toBe("Nenhuma estação para listar");
  });
});
