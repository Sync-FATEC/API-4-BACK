import { ListDashboardUseCase } from "../../../../src/application/use-cases/dashboard/ListDashboardUseCase";
import { IMeasureRepository } from "../../../../src/domain/interfaces/repositories/IMeasureRepository";
import { IStationRepository } from "../../../../src/domain/interfaces/repositories/IStationRepository";
import { IParameterRepository } from "../../../../src/domain/interfaces/repositories/IParameterRepository";

const mockMeasureRepository = {
    listWithFilters: jest.fn()
};

const mockParameterRepository = {
    list: jest.fn(),
    getWithParameterThenInclude: jest.fn()
};

const mockStationRepository = {
    findById: jest.fn(),
    list: jest.fn()
};

const makeUseCase = () => new ListDashboardUseCase(
    mockMeasureRepository as unknown as IMeasureRepository,
    mockStationRepository as unknown as IStationRepository,
    mockParameterRepository as unknown as IParameterRepository
);

describe("ListDashboardUseCase", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should return structured dashboard data", async () => {
        const filters = {
            startDate: new Date("2023-01-01"),
            endDate: new Date("2023-12-12")
        };

        const station = { id: 1, name: "Station 1", latitude: 10, longitude: 20 };
        const typeParameter = { id: 1, name: "Temperature", unit: "°C", factor: 1, offset: 0, numberOfDecimalsCases: 2 };
        const parameter = { id: 1, idStation: station, idTypeParameter: typeParameter };
        const measurement = { id: 1, value: 25, unixTime: 1700000000, parameter: { id: 1 } };

        mockMeasureRepository.listWithFilters.mockResolvedValue([measurement]);
        mockStationRepository.list.mockResolvedValue([station]);
        mockParameterRepository.list.mockResolvedValue([parameter]);
        mockParameterRepository.getWithParameterThenInclude.mockResolvedValue(parameter);
        
        const useCase = makeUseCase();

        const result = await useCase.execute(filters);

        expect(result).toEqual({
            stations: [
                {
                    id: 1,
                    name: "Station 1",
                    location: {
                        latitude: 10,
                        longitude: 20
                    },
                    parameters: [
                    {
                        id: 1,
                        name: "Temperature",
                        type: {
                            id: 1,
                            name: "Temperature",
                            unit: "°C",
                            factor: 1,
                            offset: 0,
                            decimalCases: 2
                        },
                        measurements: [
                        {
                            id: 1,
                            value: 25,
                            timestamp: new Date(1700000000 * 1000).toISOString()
                        }
                        ]
                    }
                    ]
                }
                ],
                timeRange: {
                    start: new Date(1700000000 * 1000),
                    end: new Date(1700000000 * 1000)
                },
                filters: {
                    startDate: new Date("2023-01-01"),
                    endDate: new Date("2023-12-12")
                }
        });
        
        // Verifica se o repository foi chamado com os filtros corretos
        expect(mockMeasureRepository.listWithFilters).toHaveBeenCalledWith({
            startDate: new Date("2023-01-01"),
            endDate: new Date("2023-12-12"),
            stationId: undefined,
            parameterId: undefined
        });
    });
    
    it("Should filter by specific station ID", async () => {
        const filters = {
            stationId: "station-123"
        };
        
        const station = { id: "station-123", name: "Specific Station", latitude: 10, longitude: 20 };
        const typeParameter = { id: 1, name: "Temperature", unit: "°C", factor: 1, offset: 0, numberOfDecimalsCases: 2 };
        const parameter = { id: 1, idStation: station, idTypeParameter: typeParameter };
        const measurement = { id: 1, value: 25, unixTime: 1700000000, parameter: { id: 1 } };

        mockMeasureRepository.listWithFilters.mockResolvedValue([measurement]);
        mockStationRepository.findById.mockResolvedValue(station);
        mockParameterRepository.list.mockResolvedValue([parameter]);
        mockParameterRepository.getWithParameterThenInclude.mockResolvedValue(parameter);
        
        const useCase = makeUseCase();
        const result = await useCase.execute(filters);
        
        // Verifica se o repository de estação foi chamado com o ID correto
        expect(mockStationRepository.findById).toHaveBeenCalledWith("station-123");
        expect(mockStationRepository.list).not.toHaveBeenCalled();
        
        // Verifica se os filtros foram passados corretamente para o repository
        expect(mockMeasureRepository.listWithFilters).toHaveBeenCalledWith({
            stationId: "station-123",
            startDate: undefined,
            endDate: undefined,
            parameterId: undefined
        });
    });
    
    it("Should handle empty measurements", async () => {
        mockMeasureRepository.listWithFilters.mockResolvedValue([]);
        
        const useCase = makeUseCase();
        const result = await useCase.execute();
        
        expect(result).toEqual({
            stations: [],
            timeRange: {
                start: null,
                end: null
            }
        });
        
        // Não deve chamar os outros repositories se não há medições
        expect(mockStationRepository.list).not.toHaveBeenCalled();
        expect(mockParameterRepository.list).not.toHaveBeenCalled();
    });
    
    it("Should filter by specific parameter ID", async () => {
        const filters = {
            parameterId: "param-123"
        };
        
        const station = { id: 1, name: "Station 1", latitude: 10, longitude: 20 };
        const typeParameter = { id: 1, name: "Specific Parameter", unit: "°C", factor: 1, offset: 0, numberOfDecimalsCases: 2 };
        const parameter = { id: "param-123", idStation: station, idTypeParameter: typeParameter };
        const measurement = { id: 1, value: 25, unixTime: 1700000000, parameter: { id: "param-123" } };

        mockMeasureRepository.listWithFilters.mockResolvedValue([measurement]);
        mockStationRepository.list.mockResolvedValue([station]);
        mockParameterRepository.list.mockResolvedValue([parameter]);
        mockParameterRepository.getWithParameterThenInclude.mockResolvedValue(parameter);
        
        const useCase = makeUseCase();
        const result = await useCase.execute(filters);
        
        // Verifica se os filtros foram passados corretamente para o repository
        expect(mockMeasureRepository.listWithFilters).toHaveBeenCalledWith({
            parameterId: "param-123",
            startDate: undefined,
            endDate: undefined,
            stationId: undefined
        });
    });
});