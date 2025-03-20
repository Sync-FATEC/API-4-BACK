import { Measure } from "@/domain/models/entities/Measure";

export interface IMeasureRepository {
    createMeasure(measure: Measure): Promise<Measure>;
    getMeasureById(id: string): Promise<Measure | null>;
    listMeasures(): Promise<Measure[]>;
}

