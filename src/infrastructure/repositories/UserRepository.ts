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

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected === 1;
    }

    async update(id: string, userData: Partial<User>): Promise<User | null> {
        const user = await this.repository.findOne({ where: { id } });
        if (!user) return null;

        await this.repository.update(id, userData);
        return await this.repository.findOne({ where: { id } });
    }

    async list(): Promise<User[]> {
        return await this.repository.find();
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