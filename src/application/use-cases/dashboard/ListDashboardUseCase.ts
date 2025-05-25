import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";
import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";
export class ListDashboardUseCase {
  constructor(
    private measurementRepository: IMeasureRepository,
    private stationRepository: IStationRepository,
    private parameterRepository: IParameterRepository
  ) {}

  async execute(stationId: string, startDate: Date, endDate: Date) {
    if (startDate && endDate) {
      const measures = await this.measurementRepository.listWithFilters(startDate, endDate, stationId);
      return measures;
    }
    const measures = await this.measurementRepository.listMeasures(stationId);
    return measures;
  }
}
