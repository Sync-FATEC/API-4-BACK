import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../../domain/models/entities/User';
import { TypeAlert } from '../../domain/models/agregates/Alert/TypeAlert';
import { Alert } from '../../domain/models/agregates/Alert/Alert';
import Parameter from '../../domain/models/agregates/Parameter/Parameter';
import { TypeParameter } from '../../domain/models/entities/TypeParameter';
import { Measure } from '../../domain/models/entities/Measure';
import { Station } from '../../domain/models/entities/Station';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, TypeAlert, Alert, Parameter, TypeParameter, Measure, Station],
    migrations: [],
    subscribers: []
}); 