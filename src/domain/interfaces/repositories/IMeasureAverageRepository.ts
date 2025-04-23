import { MeasureAverage } from "../../models/entities/MeasureAverage";

export interface IMeasureAverageRepository {
    createMeasureAverage(measureAverage: Partial<MeasureAverage>): Promise<MeasureAverage>;
    getById(id: string): Promise<MeasureAverage | null>;
    listMeasuresAverages(stationId: string): Promise<MeasureAverage[]>;
    listMeasuresAveragesWithStartAndEnd(stationId: string, start: Date, end: Date): Promise<MeasureAverage[]>;
    listMeasuresAveragesLast7Days(stationId: string): Promise<MeasureAverage[]>;
    listMeasuresAveragesWithDate(stationId: string, date: Date): Promise<MeasureAverage[]>;
    deleteMeasureAverage(id: string): Promise<boolean>;
}