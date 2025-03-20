import ComparisonOperator from "@/domain/enums/TypeAlert/MathOperator";

export class UpdateTypeAlertDTO {
    id: string;
    name: string;
    comparisonOperator: ComparisonOperator;
    value: number;
    parameterId: string;
}