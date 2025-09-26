import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { sanitizeObject } from '../utils/sanitizer';

interface AuthenticatedUser {
  userId: number;
  login: string;
}

interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@Controller('api')
export class ApiController {
  @UseGuards(JwtAuthGuard)
  @Get('data')
  getData(@Request() req: RequestWithUser) {
    const userInfo = req.user;
    const data = {
      message: 'protected data',
      user: userInfo,
      data: [
        { id: 1, name: 'data 1', value: 'val1' },
        { id: 2, name: 'data 2', value: 'val2' },
        { id: 3, name: 'data 3', value: 'val3' },
      ],
      timestamp: new Date().toISOString(),
    };
    return sanitizeObject(data);
  }
}
