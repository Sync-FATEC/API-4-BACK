// Não é necessário um DTO específico para listar, mas um DTO de resposta pode ser útil para organizar a resposta.
export interface ListMeasureResponseDTO {
    id: string;
    unixTime: number;
    value: number;
  }
  