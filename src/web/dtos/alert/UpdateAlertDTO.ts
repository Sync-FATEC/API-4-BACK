export class UpdateAlertDTO {
    /** ID do alerta */
    id: string;
    /** Data em que o alerta foi gerado na medida UnixTime */
    date: number;
    typeId: string;
    measureId: string;
}
