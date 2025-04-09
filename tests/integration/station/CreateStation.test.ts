import request from 'supertest';
import { app } from '../../../src/server';
import { DataSource } from 'typeorm';
import SetupIntegration, { getDataSource } from '../setup/SetupIntegration';
import { clearStationSeeds } from '../seeds/stationSeeds';
import { sign } from 'jsonwebtoken';

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

describe('Testes de Integração para criar estação - /station/create', () => {
  test('✅ Deve retornar status 200 e a estação criada', async () => {
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

    const stationPayload = {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Estação Teste',
      latitude: -23.55052,
      longitude: -46.633308,
      description: 'Descrição da estação de teste',
    };

    const response = await request(app)
      .post('/station/create')
      .set('Authorization', `Bearer ${token}`)
      .send(stationPayload);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(response.body.model).toBeDefined();
    expect(response.body.model.name).toBe('Estação Teste');
    expect(response.body.model.uuid).toBe(stationPayload.uuid);
    expect(response.body.model.latitude).toBe(stationPayload.latitude);
    expect(response.body.model.longitude).toBe(stationPayload.longitude);
    expect(response.body.model).toHaveProperty('createdAt');
  });

  test('❌ Deve retornar status 401 caso não passe o token', async () => {
    const stationPayload = {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Estação Teste',
      latitude: -23.55052,
      longitude: -46.633308,
      description: 'Descrição da estação de teste',
    };

    const response = await request(app)
      .post('/station/create')
      .send(stationPayload);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe(401);
    expect(response.body.error).toBe('Token não fornecido');
    expect(response.body.model).toBeDefined();
  });

  test('❌ Deve retornar status 401 caso o token seja inválido', async () => {
    const stationPayload = {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Estação Teste',
      latitude: -23.55052,
      longitude: -46.633308,
      description: 'Descrição da estação de teste',
    };

    const token = sign(
      {
        id: '1',
        name: 'admin',
        email: 'admin@admin.com',
        role: 'ADMIN',
      },
      'chave_errada',
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .post('/station/create')
      .set('Authorization', `Bearer ${token}`)
      .send(stationPayload);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe(401);
    expect(response.body.error).toBe('Token inválido ou expirado');
    expect(response.body.model).toBeDefined();
  });
});
