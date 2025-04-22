import { DataSource } from "typeorm";
import { Alert } from "../../domain/models/agregates/Alert/Alert";
import { TypeAlert } from "../../domain/models/agregates/Alert/TypeAlert";
import Parameter from "../../domain/models/agregates/Parameter/Parameter";
import { Station } from "../../domain/models/entities/Station";
import { TypeParameter } from "../../domain/models/entities/TypeParameter";
import { User } from "../../domain/models/entities/User";
import { Measure } from "../../domain/models/entities/Measure";
import { EmailStation } from "../../domain/models/entities/EmailsStation";
import { MeasureAverage } from "../../domain/models/entities/MeasureAverage";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [
    User,
    TypeAlert,
    Alert,
    Parameter,
    TypeParameter,
    Measure,
    Station,
    EmailStation,
    MeasureAverage
  ],
  migrations: [],
  subscribers: [],
});
