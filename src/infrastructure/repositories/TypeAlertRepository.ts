import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { ITypeAlertRepository } from "../../domain/interfaces/repositories/ITypeAlertRepository";
import { TypeAlert } from "../../domain/models/agregates/Alert/TypeAlert";
import { TypeAlertDTO } from "../../web/dtos/alert/typeAlert/TypeAlertDTO";
import { comparisonOperatorToString } from "../../domain/enums/TypeAlert/ComparisonOperator";

export default class TypeAlertRepository implements ITypeAlertRepository {
  private repository: Repository<TypeAlert>;

  constructor() {
    this.repository = AppDataSource.getRepository(TypeAlert);
  }

  async findById(id: string): Promise<TypeAlert | null> {
    return await this.repository.findOne({
      where: { id },
      relations: [
        "parameter",
        "parameter.idStation",
        "parameter.idTypeParameter",
      ],
    });
  }

  async findAll(): Promise<TypeAlertDTO[]> {
    const typeAlerts = await this.repository.find({
      relations: [
        "parameter",
        "parameter.idStation",
        "parameter.idTypeParameter",
      ],
    });
    return typeAlerts.map((typeAlert) => {
      const dto: TypeAlertDTO = {
        id: typeAlert.id,
        name: typeAlert.name,
        parameterText: typeAlert.parameter
          ? `${typeAlert.parameter.idStation.name} - ${typeAlert.parameter.idTypeParameter.name}`
          : null,
        comparisonOperator: comparisonOperatorToString(
          typeAlert.comparisonOperator
        ),
        value: typeAlert.value,
        criticality: typeAlert.criticality,
      };
      return dto;
    });
  }

  async create(typeAlert: TypeAlert): Promise<TypeAlert> {
    const newTypeAlert = this.repository.create(typeAlert);
    return this.repository.save(newTypeAlert);
  }

  async update(
    id: string,
    typeAlert: Partial<TypeAlert>
  ): Promise<TypeAlert | null> {
    const existingTypeAlert = await this.repository.findOneBy({ id });
    if (!existingTypeAlert) {
      return null;
    }
    const updatedTypeAlert = this.repository.merge(
      existingTypeAlert,
      typeAlert
    );
    return await this.repository.save(updatedTypeAlert);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id).then((result) => result.affected !== 0);
  }
}
