import { DataSource } from 'typeorm';
import { User } from '../../../domain/models/entities/User';
import bcrypt from 'bcryptjs';

export async function seedAdminUser(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);

    const adminExists = await userRepository.findOne({
        where: { email: 'admin@admin.com' }
    });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('123', 8);
        
        const adminUser = userRepository.create({
            name: 'Administrador',
            email: 'admin@admin.com',
            password: hashedPassword,
            role: 'ADMIN'
        });

        await userRepository.save(adminUser);
        console.log('Usuário administrador criado com sucesso!');
    } else {
        console.log('Usuário administrador já existe!');
    }
} 