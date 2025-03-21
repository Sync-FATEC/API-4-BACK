import { ComparisonOperator } from "../../../../domain/enums/TypeAlert/ComparisonOperator";

export class RegisterTypeAlertDTO {
    name: string;
    comparisonOperator: ComparisonOperator;
    value: number;
    parameterId: string;
}