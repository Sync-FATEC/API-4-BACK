import { Alert } from "../models/agregates/Alert/Alert";
import { TypeAlert } from "../models/agregates/Alert/TypeAlert";
import { Measure } from "../models/entities/Measure";

export interface ISenderAlertService {
    execute(alert: Alert, typeAlert: TypeAlert, measure: Measure): Promise<void>;
}
