import { defineFeature, loadFeature } from "jest-cucumber";
import SetupIntegration, { getDataSource } from "../../config/setup/SetupIntegration";
import { createStationSeed } from "../../config/seeds/createStationSeed";
import { createTypeParameterSeed } from "../../config/seeds/createTypeParameterSeed";
import { createParameterSeed } from "../../config/seeds/createParameterSeed";
import { createReceiverJsonSeed } from "../../config/seeds/createReceiverJsonSeed";
import { MeasureRepository } from "../../../../src/infrastructure/repositories/MeasureRepository";
import { ListMeasureUseCase } from "../../../../src/application/use-cases/measure/ListMeasureUseCase";
import { clearDatabase } from "../../config/setup/DatabaseCleaner";
import { DataSource } from "typeorm";

const feature = loadFeature('./tests/integration/application/receiverJson/receiverJsonUseCase.feature')
let dataSource: DataSource;

defineFeature(feature, (test) => {
    beforeAll(async () => {
        await SetupIntegration()
        dataSource = getDataSource();
    })

    beforeEach(async () => {
        await clearDatabase(dataSource);
    })
    
    afterAll(async () => {
       await dataSource.destroy(); 
    })

    test('Cadastro de medidas com sucesso', ({ given, when, then }) => {
        let estacao: any;
        let resultado: any;
        let typeParameter: any;
        
        given('que a estação esta com parametros cadastrados', async () => {
            estacao = await createStationSeed('estacao1', 'uid123', '1', '1');
            typeParameter = await createTypeParameterSeed('Temperatura', 'C', 1, 1, 0, "temperature");
            const parameter = await createParameterSeed(typeParameter, estacao);
        })

        when('o sistema receber os dados de medidas', async () => {
            const dados = {
                "uid": "uid123",
                "unixtime": 1745416800,
                "temperature": "10"
            }

            await createReceiverJsonSeed(dados);
            
            const measureRepository = new MeasureRepository();
            const listMeasureUseCase = new ListMeasureUseCase(measureRepository);
            resultado = await listMeasureUseCase.execute(estacao.id);
        })

        then('o sistema deve cadastrar todos os dados', async () => {
            expect(resultado).toBeDefined();
            expect(Array.isArray(resultado)).toBe(true);
            expect(resultado.length).toBeGreaterThan(0);
            
            const measure = resultado[0];
            expect(measure.value).toBe("10 C");
        })
    })

    test('Estação ou parametros não cadastrados', ({ given, when, then }) => {
        let initialMeasureCount: number;
        let estacao: any;
        
        given('que a estação nao tem o parametros cadastrados', async () => {
            estacao = await createStationSeed('estacao1', 'uid123', '1', '1');

            const measureRepository = new MeasureRepository();
            const listMeasureUseCase = new ListMeasureUseCase(measureRepository);
            const allMeasures = await listMeasureUseCase.execute(estacao.id);
            initialMeasureCount = allMeasures.length;
        });

        when('o sistema receber os dados de medidas', async () => {
            const dados = {
                "uid": "uid123",
                "unixtime": 1745416800,
                "temperature": "10"
            }
            await createReceiverJsonSeed(dados);
        });

        then('o sistema deve ignorar os dados recebidos', async () => {
            const measureRepository = new MeasureRepository();
            const listMeasureUseCase = new ListMeasureUseCase(measureRepository);
            const allMeasures = await listMeasureUseCase.execute(estacao.id);
            expect(allMeasures.length).toBe(initialMeasureCount);
        });
    })
})