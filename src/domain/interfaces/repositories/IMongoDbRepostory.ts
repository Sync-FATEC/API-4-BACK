import { WithId } from 'mongodb';

export interface IMongoDbRepository<T> {
    findAll(): Promise<WithId<T>[]>;
    findById(id: string): Promise<WithId<T> | null>; 
    deleteById(id: string): Promise<void>;
}
