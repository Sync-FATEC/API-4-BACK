import { ListMeasureResponseDTO } from "../../../web/dtos/measure/ListMeasureDTO";
import { Measure } from "../../models/entities/Measure";
import Parameter from "../../models/agregates/Parameter/Parameter";
import { Station } from "../../models/entities/Station";


export interface IMeasureRepository {
  createMeasure(measure: Partial<Measure>): Promise<Measure>;
  getById(id: string): Promise<Measure | null>;
  listMeasures(stationId: string): Promise<ListMeasureResponseDTO[]>;
  deleteMeasure(id: string): Promise<boolean>;
  updateMeasure(measure: Measure): Promise<Measure>;
  listMeasuresLastHour(): Promise<Measure[]>;
  listMeasuresLastDay(): Promise<Measure[]>;
  listWithFilters(startDate: Date, endDate: Date, stationId: string): Promise<ListMeasureResponseDTO[]>;
}
