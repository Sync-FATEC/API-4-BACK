import { ListMeasureResponseDTO } from "../../../web/dtos/measure/ListMeasureDTO";
import { Measure } from "../../models/agregates/Measure/Measure";

export interface IMeasureRepository {
  createMeasure(measure: Measure): Promise<Measure>;
  getById(id: string): Promise<Measure | null>;
  listMeasures(): Promise<ListMeasureResponseDTO[]>;
  deleteMeasure(id: string): Promise<boolean>;
  updateMeasure(measure: Measure): Promise<Measure>;
}
