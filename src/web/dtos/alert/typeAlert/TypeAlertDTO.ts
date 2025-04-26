export class TypeAlertDTO {
  id: string;
  name: string;
  value: number;
  comparisonOperator: string;
  parameterText: string;
  criticality: string;

  constructor(
    id: string,
    name: string,
    value: number,
    comparisonOperator: string,
    parameterText: string,
    criticality: string
  ) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.comparisonOperator = comparisonOperator;
    this.parameterText = parameterText;
    this.criticality = criticality;
  }
}
