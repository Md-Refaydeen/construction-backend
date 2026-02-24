import { createConnection } from 'typeorm';
import { User, UserRole } from './src/entities/user.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function listUsers() {
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
    const users = await userRepository.find();

    console.log('--- Current Users ---');
    users.forEach(u => console.log(`${u.email} (${u.role})`));

    await connection.close();
}

listUsers().catch(console.error);
