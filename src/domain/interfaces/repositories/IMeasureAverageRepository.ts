import { MeasureAverage } from "../../models/entities/MeasureAverage";

export interface IMeasureAverageRepository {
    createMeasureAverage(measureAverage: Partial<MeasureAverage>): Promise<MeasureAverage>;
    getById(id: string): Promise<MeasureAverage | null>;
    listMeasuresAverages(stationId: string): Promise<MeasureAverage[]>;
    deleteMeasureAverage(id: string): Promise<boolean>;
}