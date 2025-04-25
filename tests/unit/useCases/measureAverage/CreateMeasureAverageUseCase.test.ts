import { IMeasureAverageRepository } from '../../../../src/domain/interfaces/repositories/IMeasureAverageRepository';
import { IMeasureRepository } from '../../../../src/domain/interfaces/repositories/IMeasureRepository';
import { MeasureAverage } from '../../../../src/domain/models/entities/MeasureAverage';
import { CreateMeasureAverageUseCase } from '../../../../src/application/use-cases/measureAverage/CreateMeasureAverageUseCase';
import { enumAverage } from '../../../../src/domain/enums/MeasureAverage/enumAverage';
import { Station } from '../../../../src/domain/models/entities/Station';

describe('CreateMeasureAverageUseCase', () => {
    let createMeasureAverageUseCase: CreateMeasureAverageUseCase;
    let mockMeasureAverageRepository: jest.Mocked<IMeasureAverageRepository>;
    let mockMeasureRepository: jest.Mocked<IMeasureRepository>;

    beforeEach(() => {
        // Cria mocks dos repositórios
        mockMeasureAverageRepository = {
            createMeasureAverage: jest.fn(),
            getById: jest.fn(),
            listMeasuresAverages: jest.fn(),
            deleteMeasureAverage: jest.fn(),
            listMeasuresAveragesWithStartAndEnd: jest.fn(),
            listMeasuresAveragesLast7Days: jest.fn(),
            listMeasuresAveragesWithDate: jest.fn(),
        } as jest.Mocked<IMeasureAverageRepository>;

        mockMeasureRepository = {
            createMeasure: jest.fn(),
            getById: jest.fn(),
            listMeasures: jest.fn(),
            deleteMeasure: jest.fn(),
            updateMeasure: jest.fn(),
            listMeasuresLastHour: jest.fn(),
            listMeasuresLastDay: jest.fn(),
            listWithFilters: jest.fn(),
        } as jest.Mocked<IMeasureRepository>;

        // Instancia o CreateMeasureAverageUseCase com os repositórios mockados
        createMeasureAverageUseCase = new CreateMeasureAverageUseCase(
            mockMeasureAverageRepository,
            mockMeasureRepository
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('executeLastHour', () => {
        it('✅ deve calcular e salvar médias de medidas da última hora corretamente', async () => {
            // Arrange
            const mockMeasures = createMockMeasures();
            mockMeasureRepository.listMeasuresLastHour.mockResolvedValue(mockMeasures);
            
            const mockMeasureAverage = createMockMeasureAverage('1', enumAverage.HOUR, 'Estação A - Temperatura', '25.50');
            mockMeasureAverageRepository.createMeasureAverage.mockResolvedValue(mockMeasureAverage);

            // Act
            const result = await createMeasureAverageUseCase.executeLastHour();

            // Assert
            expect(mockMeasureRepository.listMeasuresLastHour).toHaveBeenCalledTimes(1);
            expect(mockMeasureAverageRepository.createMeasureAverage).toHaveBeenCalledTimes(2); // 2 grupos de medidas
            expect(result).toHaveLength(2);
            expect(result[0].typeAverage).toBe(enumAverage.HOUR);
            expect(result[0].value).toBe('25.50');
        });

        it('❌ deve retornar array vazio quando não houver medidas na última hora', async () => {
            // Arrange
            mockMeasureRepository.listMeasuresLastHour.mockResolvedValue([]);

            // Act
            const result = await createMeasureAverageUseCase.executeLastHour();

            // Assert
            expect(mockMeasureRepository.listMeasuresLastHour).toHaveBeenCalledTimes(1);
            expect(mockMeasureAverageRepository.createMeasureAverage).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe('executeLastDay', () => {
        it('✅ deve calcular e salvar médias de medidas do último dia corretamente', async () => {
            // Arrange
            const mockMeasures = createMockMeasures();
            mockMeasureRepository.listMeasuresLastDay.mockResolvedValue(mockMeasures);
            
            const mockMeasureAverage = createMockMeasureAverage('1', enumAverage.DAY, 'Estação A - Temperatura', '25.50');
            mockMeasureAverageRepository.createMeasureAverage.mockResolvedValue(mockMeasureAverage);

            // Act
            const result = await createMeasureAverageUseCase.executeLastDay();

            // Assert
            expect(mockMeasureRepository.listMeasuresLastDay).toHaveBeenCalledTimes(1);
            expect(mockMeasureAverageRepository.createMeasureAverage).toHaveBeenCalledTimes(2); // 2 grupos de medidas
            expect(result).toHaveLength(2);
            expect(result[0].typeAverage).toBe(enumAverage.DAY);
            expect(result[0].value).toBe('25.50');
        });

        it('❌ deve retornar array vazio quando não houver medidas no último dia', async () => {
            // Arrange
            mockMeasureRepository.listMeasuresLastDay.mockResolvedValue([]);

            // Act
            const result = await createMeasureAverageUseCase.executeLastDay();

            // Assert
            expect(mockMeasureRepository.listMeasuresLastDay).toHaveBeenCalledTimes(1);
            expect(mockMeasureAverageRepository.createMeasureAverage).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });
});

// Funções auxiliares para criar mocks
function createMockMeasureAverage(id: string, typeAverage: enumAverage, name: string, value: string): MeasureAverage {
    const measureAverage = new MeasureAverage();
    measureAverage.id = id;
    measureAverage.typeAverage = typeAverage;
    measureAverage.name = name;
    measureAverage.value = value;
    measureAverage.createdAt = new Date();
    return measureAverage;
}

function createMockMeasures() {
    // Cria estações mock
    const stationA = new Station();
    stationA.id = 'station-a-id';
    stationA.name = 'Estação A';

    const stationB = new Station();
    stationB.id = 'station-b-id';
    stationB.name = 'Estação B';

    // Parâmetros mock para Temperatura e Umidade
    const tempTypeParam = {
        id: 'temp-id',
        name: 'Temperatura',
        typeJson: 'number',
        unit: '°C',
        numberOfDecimalsCases: 2,
        factor: 1,
        offset: 0,
        parameters: []
    };

    const humidTypeParam = {
        id: 'humid-id',
        name: 'Umidade',
        typeJson: 'number',
        unit: '%',
        numberOfDecimalsCases: 2,
        factor: 1,
        offset: 0,
        parameters: []
    };

    // Cria medidas mockadas
    return [
        {
            id: 'measure-1',
            value: 25,
            unixTime: Math.floor(Date.now() / 1000),
            alerts: [],
            parameter: {
                id: 'param-1',
                idStation: stationA,
                idTypeParameter: tempTypeParam,
                typeAlerts: [],
                measures: [],
                getParameterName: function () {
                    return this.idStation.name + ' - ' + this.idTypeParameter.name;
                }
            }
        },
        {
            id: 'measure-2',
            value: 26,
            unixTime: Math.floor(Date.now() / 1000),
            alerts: [],
            parameter: {
                id: 'param-1',
                idStation: stationA,
                idTypeParameter: tempTypeParam,
                typeAlerts: [],
                measures: [],
                getParameterName: function () {
                    return this.idStation.name + ' - ' + this.idTypeParameter.name;
                }
            }
        },
        {
            id: 'measure-3',
            value: 65,
            unixTime: Math.floor(Date.now() / 1000),
            alerts: [],
            parameter: {
                id: 'param-2',
                idStation: stationB,
                idTypeParameter: humidTypeParam,
                typeAlerts: [],
                measures: [],
                getParameterName: function () {
                    return this.idStation.name + ' - ' + this.idTypeParameter.name;
                }
            }
        },
        {
            id: 'measure-4',
            value: 67,
            unixTime: Math.floor(Date.now() / 1000),
            alerts: [],
            parameter: {
                id: 'param-2',
                idStation: stationB,
                idTypeParameter: humidTypeParam,
                typeAlerts: [],
                measures: [],
                getParameterName: function () {
                    return this.idStation.name + ' - ' + this.idTypeParameter.name;
                }
            }
        }
    ];
}
