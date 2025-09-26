import { User } from './user.entity';
export declare class Post {
    id: number;
    title: string;
    content: string;
    userId: number;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
