import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
interface ValidatedUser {
    id: number;
    login: string;
    email?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    validateUser(login: string, password: string): Promise<ValidatedUser | null>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    hashPassword(password: string): Promise<string>;
}
export {};
