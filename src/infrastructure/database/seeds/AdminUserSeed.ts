import { DataSource } from 'typeorm';
import { User } from '../../../domain/models/entities/User';
import bcrypt from 'bcryptjs';
import hashPassword from '../../../application/operations/auth/hashPassword';
import { runSeeds } from '.';

export async function seedAdminUser(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);

    const adminExists = await userRepository.findOne({
        where: { email: 'admin@admin.com' }
    });

    if (!adminExists) {
        const hashedPassword = await hashPassword('123');
        
        const adminUser = userRepository.create({
            name: 'Administrador',
            email: 'admin@admin.com',
            password: hashedPassword,
            role: 'ADMIN',
            active: true
        });

        await userRepository.save(adminUser);
        await runSeeds();
    } else {
    }
} 