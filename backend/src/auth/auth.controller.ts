import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

/**
 * @class AuthController
 * @description Exposes high-level authentication management REST routes to clients.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  /**
   * @method login
   * @description Receives, checks, and validates raw user session requests.
   */
  @Post('login')
  async login(@Body() body: any) {
    const username = body?.username || '';
    const password = body?.password || '';

    if (!username || !password) {
      throw new UnauthorizedException(
        'Username and password fields are strictly required.',
      );
    }

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials matching records.');
    }
    return this.authService.login(user);
  }

  /**
   * @method register
   * @description Handles administrative setup calls for new staff entries.
   */
  @Post('register')
  async register(@Body() body: any) {
    if (!body?.adminPassphrase || body.adminPassphrase !== 'admin-root-key') {
      throw new UnauthorizedException(
        'Only an administrator can perform user creation tasks.',
      );
    }
    return this.usersService.create({
      username: body.username,
      email: body.email,
      password: body.password,
    });
  }
}
