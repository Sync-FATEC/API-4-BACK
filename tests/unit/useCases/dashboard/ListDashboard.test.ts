import { ListDashboardUseCase } from "../../../../src/application/use-cases/dashboard/ListDashboardUseCase";
import { IMeasureRepository } from "../../../../src/domain/interfaces/repositories/IMeasureRepository";
import { IStationRepository } from "../../../../src/domain/interfaces/repositories/IStationRepository";
import { IParameterRepository } from "../../../../src/domain/interfaces/repositories/IParameterRepository";
import { timeStamp } from "console";

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
            }
        });
    });
});