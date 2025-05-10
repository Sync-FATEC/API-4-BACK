import { IMeasureAverageRepository } from "../../../domain/interfaces/repositories/IMeasureAverageRepository";
import { IMeasureRepository } from "../../../domain/interfaces/repositories/IMeasureRepository";
import { MeasureAverage } from "../../../domain/models/entities/MeasureAverage";
import { enumAverage } from "../../../domain/enums/MeasureAverage/enumAverage";
import { Station } from "../../../domain/models/entities/Station";

export class CreateMeasureAverageUseCase {
    constructor(
        private measureAverageRepository: IMeasureAverageRepository,
        private measureRepository: IMeasureRepository
    ) { }

    async executeLastHour(): Promise<any> {
        const measures = await this.measureRepository.listMeasuresLastHour();

        const groupedMeasures = this.groupMeasuresByStationAndParameterType(measures);

        const results = this.saveMeasureAverage(groupedMeasures, enumAverage.HOUR);

        return results;
    }

    async executeLastDay(): Promise<any> {
        const measures = await this.measureRepository.listMeasuresLastDay();

        const groupedMeasures = this.groupMeasuresByStationAndParameterType(measures);

        const results = this.saveMeasureAverage(groupedMeasures, enumAverage.DAY);

        return results;
    }

    private groupMeasuresByStationAndParameterType(measures: any[]): {
        [stationId: string]: {
            [parameterTypeId: string]: {
                stationName: string,
                parameterName: string,
                values: number[],
                count: number,
                sum: number
            }
        }
    } {
        // Estrutura para agrupar medidas por estação e tipo de parâmetro
        const groupedMeasures: {
            [stationId: string]: {
                [parameterTypeId: string]: {
                    stationName: string,
                    parameterName: string,
                    values: number[],
                    count: number,
                    sum: number
                }
            }
        } = {};

        // Agrupar medidas por estação e tipo de parâmetro
        measures.forEach((measure) => {
            const stationId = measure.parameter.idStation.id;
            const parameterTypeId = measure.parameter.idTypeParameter.id;
            const stationName = measure.parameter.idStation.name;
            const parameterName = measure.parameter.idTypeParameter.name;

            // Inicializar estrutura se não existir
            if (!groupedMeasures[stationId]) {
                groupedMeasures[stationId] = {};
            }

            if (!groupedMeasures[stationId][parameterTypeId]) {
                groupedMeasures[stationId][parameterTypeId] = {
                    stationName,
                    parameterName,
                    values: [],
                    count: 0,
                    sum: 0
                };
            }

            // Adicionar valor à lista e atualizar soma e contagem
            groupedMeasures[stationId][parameterTypeId].values.push(measure.value);
            groupedMeasures[stationId][parameterTypeId].sum += measure.value;
            groupedMeasures[stationId][parameterTypeId].count++;
        });

        return groupedMeasures;
    }

    private async saveMeasureAverage(groupedMeasures: any, enumTypeAverage: enumAverage): Promise<MeasureAverage[]> {
        const promises: Promise<MeasureAverage>[] = [];

        for (const stationId in groupedMeasures) {
            for (const parameterTypeId in groupedMeasures[stationId]) {
                const group = groupedMeasures[stationId][parameterTypeId];
                const average = group.sum / group.count;

                const measureAverage = new MeasureAverage();
                measureAverage.CreateMeasureAverage(
                    enumTypeAverage,
                    `${group.parameterName}`,
                    average.toFixed(2)
                );

                const station = new Station();
                station.id = stationId;
                measureAverage.station = station;

                // Adiciona a promessa ao array
                promises.push(this.measureAverageRepository.createMeasureAverage(measureAverage));
            }
        }

        // Espera todas as inserções serem feitas
        const results = await Promise.all(promises);

        return results;
    }

}