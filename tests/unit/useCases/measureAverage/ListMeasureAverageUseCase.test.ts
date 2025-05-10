import { IMeasureAverageRepository } from '../../../../src/domain/interfaces/repositories/IMeasureAverageRepository';
import { MeasureAverage } from '../../../../src/domain/models/entities/MeasureAverage';
import ListMeasureAverageUseCase from '../../../../src/application/use-cases/measureAverage/ListMeasureAverageUseCase';
import { SystemContextException } from '../../../../src/domain/exceptions/SystemContextException';
import { enumAverage } from '../../../../src/domain/enums/MeasureAverage/enumAverage';
import { IStationRepository } from '../../../../src/domain/interfaces/repositories/IStationRepository';

describe('ListMeasureAverageUseCase', () => {
    let listMeasureAverageUseCase: ListMeasureAverageUseCase;
    let mockMeasureAverageRepository: jest.Mocked<IMeasureAverageRepository>;
    let mockStationRepository: jest.Mocked<IStationRepository>;

    beforeEach(() => {
        mockMeasureAverageRepository = {
            createMeasureAverage: jest.fn(),
            getById: jest.fn(),
            listMeasuresAverages: jest.fn(),
            deleteMeasureAverage: jest.fn(),
            listMeasuresAveragesWithStartAndEnd: jest.fn(),
            listMeasuresAveragesLast7Days: jest.fn(),
            listMeasuresAveragesWithDate: jest.fn()
        } as jest.Mocked<IMeasureAverageRepository>;

        mockStationRepository = {
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            list: jest.fn(),
            listWithParameters: jest.fn(),
            findById: jest.fn(),
            findByUuid: jest.fn()
        } as jest.Mocked<IStationRepository>;

        listMeasureAverageUseCase = new ListMeasureAverageUseCase(
            mockMeasureAverageRepository,
            mockStationRepository
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('✅ Deve retornar uma lista de médias quando houver dados disponíveis', async () => {
        const stationId = '123e4567-e89b-12d3-a456-426614174000';

        // Simula que a estação existe - usa findById conforme o use case
        mockStationRepository.findById.mockResolvedValue({
            id: 1,
            uuid: stationId,
            name: 'Estação A'
        } as any);

        const mockMeasureAverages: MeasureAverage[] = [
            createMockMeasureAverage('1', enumAverage.DAY, 'Estação teste - Temperatura', '25.5'),
            createMockMeasureAverage('2', enumAverage.HOUR, 'Estação teste - Umidade', '65.3')
        ];

        mockMeasureAverageRepository.listMeasuresAveragesLast7Days.mockResolvedValue(mockMeasureAverages);

        const result = await listMeasureAverageUseCase.execute(stationId);

        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0].GetId()).toBe('1');
        expect(result[0].GetTypeAverage()).toBe(enumAverage.DAY);
        expect(result[0].GetName()).toBe('Estação teste - Temperatura');
        expect(result[0].GetValue()).toBe('25.5');
        expect(mockStationRepository.findById).toHaveBeenCalledWith(stationId);
        expect(mockMeasureAverageRepository.listMeasuresAveragesLast7Days).toHaveBeenCalledWith(stationId);
        expect(mockMeasureAverageRepository.listMeasuresAveragesLast7Days).toHaveBeenCalledTimes(1);
    });

    it('❌ Deve lançar exceção quando não houver dados para retornar', async () => {
        const stationId = '123e4567-e89b-12d3-a456-426614174000';

        // Simula que a estação existe
        mockStationRepository.findById.mockResolvedValue({
            id: 1,
            uuid: stationId,
            name: 'Estação B'
        } as any);

        // Simula retorno vazio de medidas
        mockMeasureAverageRepository.listMeasuresAveragesLast7Days.mockResolvedValue([]);

        await expect(listMeasureAverageUseCase.execute(stationId))
            .rejects
            .toThrow(new SystemContextException('Nenhuma media de medida para listar'));

        expect(mockStationRepository.findById).toHaveBeenCalledWith(stationId);
        expect(mockMeasureAverageRepository.listMeasuresAveragesLast7Days).toHaveBeenCalledWith(stationId);
        expect(mockMeasureAverageRepository.listMeasuresAveragesLast7Days).toHaveBeenCalledTimes(1);
    });

    it('❌ Deve lançar exceção quando a estação não for encontrada', async () => {
        const stationId = 'station-nao-existe';

        // Simula que a estação não existe
        mockStationRepository.findById.mockResolvedValue(null);

        await expect(listMeasureAverageUseCase.execute(stationId))
            .rejects
            .toThrow(new SystemContextException('Estação não encontrada'));

        expect(mockStationRepository.findById).toHaveBeenCalledWith(stationId);
        expect(mockStationRepository.findById).toHaveBeenCalledTimes(1);
        // Não deve chegar a chamar o repository de medidas se a estação não for encontrada
        expect(mockMeasureAverageRepository.listMeasuresAveragesLast7Days).not.toHaveBeenCalled();
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
    
    // Adiciona os getters que são usados nos testes
    measureAverage.GetId = (): string => id;
    measureAverage.GetTypeAverage = (): enumAverage => typeAverage;
    measureAverage.GetName = (): string => name;
    measureAverage.GetValue = (): string => value;
    
    return measureAverage;
}
