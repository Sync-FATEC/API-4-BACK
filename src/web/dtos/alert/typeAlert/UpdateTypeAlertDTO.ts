import { ComparisonOperator } from "../../../../domain/enums/TypeAlert/ComparisonOperator";
import { Criticality } from "../../../../domain/enums/TypeAlert/Criticality";

export class UpdateTypeAlertDTO {
    id: string;
    name: string;
    comparisonOperator: ComparisonOperator;
    criticality: Criticality
    value: number;
    parameterId: string;
}