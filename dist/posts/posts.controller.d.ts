import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
interface AuthenticatedUser {
    userId: number;
    login: string;
}
interface RequestWithUser extends Request {
    user: AuthenticatedUser;
}
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: RequestWithUser): Promise<import("../entities/post.entity").Post>;
    findAll(): Promise<import("../entities/post.entity").Post[]>;
    findOne(id: number): Promise<import("../entities/post.entity").Post>;
    remove(id: number, req: RequestWithUser): Promise<void>;
}
export {};
