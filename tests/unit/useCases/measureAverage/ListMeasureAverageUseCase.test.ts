import { IMeasureAverageRepository } from '../../../../src/domain/interfaces/repositories/IMeasureAverageRepository';
import { MeasureAverage } from '../../../../src/domain/models/entities/MeasureAverage';
import ListMeasureAverageUseCase from '../../../../src/application/use-cases/measureAverage/ListMeasureAverageUseCase';
import { SystemContextException } from '../../../../src/domain/exceptions/SystemContextException';
import { enumAverage } from '../../../../src/domain/enums/MeasureAverage/enumAverage';

describe('ListMeasureAverageUseCase', () => {
    let listMeasureAverageUseCase: ListMeasureAverageUseCase;
    let mockMeasureAverageRepository: jest.Mocked<IMeasureAverageRepository>;

    beforeEach(() => {
        // Cria um mock do MeasureAverageRepository
        mockMeasureAverageRepository = {
            createMeasureAverage: jest.fn(),
            getById: jest.fn(),
            listMeasuresAverages: jest.fn(),
            deleteMeasureAverage: jest.fn()
        } as jest.Mocked<IMeasureAverageRepository>;

        // Instancia o ListMeasureAverageUseCase com o repositório mockado
        listMeasureAverageUseCase = new ListMeasureAverageUseCase(mockMeasureAverageRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('✅ deve retornar uma lista de médias de medidas quando existirem dados', async () => {
        // Arrange
        const stationId = '123e4567-e89b-12d3-a456-426614174000';
        
        const mockMeasureAverages: MeasureAverage[] = [
            createMockMeasureAverage('1', enumAverage.DAY, 'Estação teste - Temperatura', '25.5'),
            createMockMeasureAverage('2', enumAverage.HOUR, 'Estação teste - Umidade', '65.3')
        ];

        mockMeasureAverageRepository.listMeasuresAverages.mockResolvedValue(mockMeasureAverages);

        // Act
        const result = await listMeasureAverageUseCase.execute(stationId);

        // Assert
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0].GetId()).toBe('1');
        expect(result[0].GetTypeAverage()).toBe(enumAverage.DAY);
        expect(result[0].GetName()).toBe('Estação teste - Temperatura');
        expect(result[0].GetValue()).toBe('25.5');
        expect(mockMeasureAverageRepository.listMeasuresAverages).toHaveBeenCalledWith(stationId);
        expect(mockMeasureAverageRepository.listMeasuresAverages).toHaveBeenCalledTimes(1);
    });

    it('❌ deve lançar erro quando não existirem médias de medidas para listar', async () => {
        // Arrange
        const stationId = '123e4567-e89b-12d3-a456-426614174000';
        mockMeasureAverageRepository.listMeasuresAverages.mockResolvedValue(null);

        // Act & Assert
        await expect(listMeasureAverageUseCase.execute(stationId))
            .rejects
            .toThrow(new SystemContextException('Nenhuma media de medida para listar'));
        
        expect(mockMeasureAverageRepository.listMeasuresAverages).toHaveBeenCalledWith(stationId);
        expect(mockMeasureAverageRepository.listMeasuresAverages).toHaveBeenCalledTimes(1);
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