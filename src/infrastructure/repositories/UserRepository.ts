import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { User, IUserRepository } from '../../domain/entities/User';

export class UserRepository implements IUserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.repository.create(userData);
        return await this.repository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findByCpf(cpf: string): Promise<User | null> {
        return await this.repository.findOne({ where: { cpf } });
    }
} 