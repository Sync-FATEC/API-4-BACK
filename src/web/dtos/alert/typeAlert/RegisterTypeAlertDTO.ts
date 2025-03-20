import ComparisonOperator from "@/domain/enums/TypeAlert/MathOperator";

export class RegisterTypeAlertDTO {
    name: string;
    comparisonOperator: ComparisonOperator;
    value: number;
    parameterId: string;
}