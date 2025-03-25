import { Alert } from "../../models/agregates/Alert/Alert";

export interface IAlertRepository {
    createAlert(alert: Alert): Promise<Alert>;
    getAlertById(id: string): Promise<Alert | null>;
    getAllAlerts(): Promise<Alert[]>;
    deleteAlert(id: string): Promise<boolean>;
    updateAlert(alert: Alert): Promise<Alert>;
}
