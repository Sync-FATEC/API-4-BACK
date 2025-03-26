import { ListMeasureResponseDTO } from "../measure/ListMeasureDTO";

export class ListAlertDTO {
    id: string;
    message: string;
    measure: ListMeasureResponseDTO;    

    constructor(id: string, message: string, measure: ListMeasureResponseDTO) {
        this.id = id;
        this.message = message;
        this.measure = measure;
    }
}