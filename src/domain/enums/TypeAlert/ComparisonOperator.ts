export enum ComparisonOperator {
    EQUAL = "=",
    GREATER_THAN = ">",
    LESS_THAN = "<",
}

export function comparisonOperatorToString(operator: ComparisonOperator): string {
    switch (operator) {
        case ComparisonOperator.EQUAL:
            return "=";
        case ComparisonOperator.GREATER_THAN:
            return ">";
        case ComparisonOperator.LESS_THAN:
            return "<";
        default:
            throw new Error("Invalid ComparisonOperator");
    }
}

