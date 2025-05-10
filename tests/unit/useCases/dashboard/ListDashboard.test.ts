import { ListDashboardUseCase } from "../../../../src/application/use-cases/dashboard/ListDashboardUseCase";
import { IMeasureRepository } from "../../../../src/domain/interfaces/repositories/IMeasureRepository";
import { IStationRepository } from "../../../../src/domain/interfaces/repositories/IStationRepository";
import { IParameterRepository } from "../../../../src/domain/interfaces/repositories/IParameterRepository";

const mockMeasureRepository = {
    listWithFilters: jest.fn(),
    listMeasures: jest.fn()
};

const mockParameterRepository = {
    list: jest.fn(),
    getWithParameterThenInclude: jest.fn()
};

const mockStationRepository = {
    findById: jest.fn(),
    list: jest.fn()
};

const makeUseCase = (): ListDashboardUseCase => new ListDashboardUseCase(
    mockMeasureRepository as unknown as IMeasureRepository,
    mockStationRepository as unknown as IStationRepository,
    mockParameterRepository as unknown as IParameterRepository
);

describe("ListDashboardUseCase", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should return measures when both dates are provided", async () => {
        // Arrange
        const startDate = new Date("2023-01-01");
        const endDate = new Date("2023-12-12");
        const stationId = "station-1";
        
        const expectedMeasures = [
            { id: 1, value: 25, unixTime: 1700000000, parameter: { id: 1 } }
        ];

        mockMeasureRepository.listWithFilters.mockResolvedValue(expectedMeasures);
        
        const useCase = makeUseCase();

        // Act
        const result = await useCase.execute(stationId, startDate, endDate);

        // Assert
        expect(result).toBe(expectedMeasures);
        expect(mockMeasureRepository.listWithFilters).toHaveBeenCalledWith(startDate, endDate, stationId);
        expect(mockMeasureRepository.listMeasures).not.toHaveBeenCalled();
    });
    
    it("Should return measures from listMeasures when dates are not provided", async () => {
        // Arrange
        const stationId = "station-123";
        
        const expectedMeasures = [
            { id: 1, value: 25, unixTime: 1700000000, parameter: { id: "param-1" } }
        ];

        mockMeasureRepository.listMeasures.mockResolvedValue(expectedMeasures);
        
        const useCase = makeUseCase();
        
        // Act
        const result = await useCase.execute(stationId, null, null);
        
        // Assert
        expect(result).toBe(expectedMeasures);
        expect(mockMeasureRepository.listMeasures).toHaveBeenCalledWith(stationId);
        expect(mockMeasureRepository.listWithFilters).not.toHaveBeenCalled();
    });
    
    it("Should handle missing stationId for listMeasures", async () => {
        // Arrange
        mockMeasureRepository.listMeasures.mockResolvedValue([]);
        
        const useCase = makeUseCase();
        
        // Act
        const result = await useCase.execute(null, null, null);
        
        // Assert
        expect(result).toEqual([]);
        expect(mockMeasureRepository.listMeasures).toHaveBeenCalledWith(null);
    });
    
    it("Should handle starting date without ending date", async () => {
        // Arrange
        const stationId = "station-1";
        const startDate = new Date("2023-01-01");
        
        const expectedMeasures = [
            { id: 1, value: 25, unixTime: 1700000000, parameter: { id: "param-1" } }
        ];

        mockMeasureRepository.listMeasures.mockResolvedValue(expectedMeasures);
        
        const useCase = makeUseCase();
        
        // Act
        const result = await useCase.execute(stationId, startDate, null);
        
        // Assert
        expect(result).toBe(expectedMeasures);
        expect(mockMeasureRepository.listMeasures).toHaveBeenCalledWith(stationId);
        expect(mockMeasureRepository.listWithFilters).not.toHaveBeenCalled();
    });
});
