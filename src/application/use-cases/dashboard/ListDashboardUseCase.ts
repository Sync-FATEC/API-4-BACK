import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { IStationRepository } from "../../../domain/interfaces/repositories/IStationRepository";
import { IParameterRepository } from "../../../domain/interfaces/repositories/IParameterRepository";
import { Measure } from "../../../domain/models/entities/Measure";

interface DashboardFilters {
  startDate?: Date;
  endDate?: Date;
  stationId?: string;
  parameterId?: string;
}

export class ListDashboardUseCase {
  constructor(
    private measurementRepository: IMeasureRepository,
    private stationRepository: IStationRepository,
    private parameterRepository: IParameterRepository
  ) {}

  async execute(filters: DashboardFilters = {}) {
    try {
      // Get all measurements matching the filters
      const measurements = await this.measurementRepository.listWithFilters({
        startDate: filters.startDate,
        endDate: filters.endDate,
        stationId: filters.stationId,
        parameterId: filters.parameterId
      });
      
      if (measurements.length === 0) {
        return {
          stations: [],
          timeRange: {
            start: filters.startDate || null,
            end: filters.endDate || null
          }
        };
      }

      const stations = filters.stationId 
        ? [await this.stationRepository.findById(filters.stationId)]
        : await this.stationRepository.list();
      
      // Pega os parametro com seus relacionados
      const parameters = await Promise.all(
        (await this.parameterRepository.list()).map(async p => {
          return await this.parameterRepository.getWithParameterThenInclude(p.id);
        })
      ).then(params => params.filter(p => p !== null));
      
      // Agrupa as medições com o ID do parametro
      const measurementsByParameter = new Map();
      
      for (const measurement of measurements) {
        if (!measurement.parameter || !measurement.parameter.id) {
          continue;
        }
        
        const parameterId = measurement.parameter.id;
        
        if (!measurementsByParameter.has(parameterId)) {
          measurementsByParameter.set(parameterId, []);
        }
        
        measurementsByParameter.get(parameterId).push({
          id: measurement.id,
          value: measurement.value,
          timestamp: new Date(measurement.unixTime * 1000).toISOString()
        });
      }
      
      const stationsWithData = stations.map(station => {
        const stationParameters = parameters.filter(p => 
          p.idStation && p.idStation.id === station.id
        );
        
        const parametersWithDetails = stationParameters.map(param => {
          const typeParam = param.idTypeParameter;
          
          const measurementsForParameter = measurementsByParameter.get(param.id) || [];
          
          return {
            id: param.id,
            name: typeParam ? typeParam.name : "Unknown Parameter",
            type: typeParam ? {
              id: typeParam.id,
              name: typeParam.name,
              unit: typeParam.unit,
              factor: typeParam.factor,
              offset: typeParam.offset,
              decimalCases: typeParam.numberOfDecimalsCases
            } : null,
            measurements: measurementsForParameter
          };
        });
        
        const hasAnyMeasurements = parametersWithDetails.some(p => p.measurements.length > 0);
        
        return {
          id: station.id,
          name: station.name,
          location: {
            latitude: station.latitude,
            longitude: station.longitude
          },
          parameters: parametersWithDetails,
          hasData: hasAnyMeasurements
        };
      });
      
      const filteredStations = filters.stationId 
        ? stationsWithData 
        : stationsWithData.filter(s => s.hasData);
        
      filteredStations.forEach(s => delete s.hasData);
      
      return {
        stations: filteredStations,
        timeRange: {
          start: this.getMinDate(measurements),
          end: this.getMaxDate(measurements)
        },
        filters: {
          startDate: filters.startDate,
          endDate: filters.endDate,
          stationId: filters.stationId,
          parameterId: filters.parameterId
        }
      };
    } catch (error) {
      throw error;
    }
  }

  private getMinDate(measurements: Measure[]): Date | null {
    if (!measurements || measurements.length === 0) {
      return null;
    }
    const timestamps = measurements
      .map(m => m.unixTime)
      .filter(t => t !== undefined && t !== null);
    
    return timestamps.length > 0 ? new Date(Math.min(...timestamps) * 1000) : null;
  }

  private getMaxDate(measurements: Measure[]): Date | null {
    if (!measurements || measurements.length === 0) {
      return null;
    }
    const timestamps = measurements
      .map(m => m.unixTime)
      .filter(t => t !== undefined && t !== null);
    
    return timestamps.length > 0 ? new Date(Math.max(...timestamps) * 1000) : null;
  }
}
