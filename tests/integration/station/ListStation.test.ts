import request from 'supertest';
import { app } from '../../../src/server';
import { sign } from 'jsonwebtoken';
import { DataSource } from 'typeorm';
import { runStationSeeds, clearStationSeeds } from '../seeds/stationSeeds';
import SetupIntegration, { getDataSource } from '../setup/SetupIntegration';

// Configurar JWT secreto para testes
process.env.JWT_SECRET = 'minha_chave_secreta_para_testes';

let dataSource: DataSource;

beforeAll(async () => {
  await SetupIntegration();
  dataSource = getDataSource();
});

beforeEach(async () => {
  await clearStationSeeds(dataSource);
});

afterEach(async () => {
  await clearStationSeeds(dataSource);
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('Testes de Integração para listar estação - /station/list', () => {
  test('✅ Deve retornar status 200 e lista de estações via API', async () => {
    await runStationSeeds(dataSource);

    const token = sign(
      {
        id: '1',
        name: 'admin',
        email: 'admin@admin.com',
        role: 'ADMIN',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .get('/station/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(Array.isArray(response.body.model)).toBe(true);
    expect(response.body.model.length).toBe(3);

    const stationNames = response.body.model.map((station: any) => station.name);
    expect(stationNames).toContain('Estação Centro');
    expect(stationNames).toContain('Estação Norte');
    expect(stationNames).toContain('Estação Sul');
  });

  test('❌ Deve retornar status 400 caso a lista esteja vazia', async () => {
    const token = sign(
      {
        id: '1',
        name: 'admin',
        email: 'admin@admin.com',
        role: 'ADMIN',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .get('/station/list')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe(400);
    expect(response.body.model).toBeNull();
    expect(response.body.error).toBe('Nenhuma estação para listar');
  });
});
