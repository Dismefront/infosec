import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsService {
    private postRepository;
    constructor(postRepository: Repository<Post>);
    create(createPostDto: CreatePostDto, userId: number): Promise<Post>;
    findAll(): Promise<Post[]>;
    findOne(id: number): Promise<Post>;
    remove(id: number, userId: number): Promise<void>;
}
