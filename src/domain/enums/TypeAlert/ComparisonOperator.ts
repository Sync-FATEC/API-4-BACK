export enum ComparisonOperator {
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
}

export function comparisonOperatorToString(operator: ComparisonOperator): string {
    switch (operator) {
        case ComparisonOperator.GreaterThan:
            return ">";
        case ComparisonOperator.GreaterThanOrEqual:
            return ">=";
        case ComparisonOperator.LessThan:
            return "<";
        case ComparisonOperator.LessThanOrEqual:
            return "<=";
        default:
            throw new Error("Invalid ComparisonOperator");
    }
}

