import { createConnection } from 'typeorm';
import { User, UserRole } from './src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function seedUsers() {
    const connection = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [User],
        synchronize: false,
        ssl: {
            rejectUnauthorized: false
        }
    });

    const userRepository = connection.getRepository(User);

    const usersToCreate = [
        { name: 'System Administrator', email: 'admin@tracker.com', password: 'password123', role: UserRole.ADMIN },
        { name: 'Site Supervisor', email: 'supervisor@tracker.com', password: 'password123', role: UserRole.USER }
    ];

    for (const u of usersToCreate) {
        const existing = await userRepository.findOne({ where: { email: u.email } });
        if (!existing) {
            const hashedPassword = await bcrypt.hash(u.password, 10);
            const newUser = userRepository.create({
                ...u,
                password: hashedPassword
            });
            await userRepository.save(newUser);
            console.log(`Created ${u.role}: ${u.email}`);
        } else {
            // Update password for existing user
            const hashedPassword = await bcrypt.hash(u.password, 10);
            existing.password = hashedPassword;
            await userRepository.save(existing);
            console.log(`Updated password for ${u.role}: ${u.email}`);
        }
    }

    await connection.close();
}

seedUsers().catch(console.error);
