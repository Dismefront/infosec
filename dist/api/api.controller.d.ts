interface AuthenticatedUser {
    userId: number;
    login: string;
}
interface RequestWithUser extends Request {
    user: AuthenticatedUser;
}
export declare class ApiController {
    getData(req: RequestWithUser): any;
}
export {};
