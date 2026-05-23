import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

/**
 * @class AuthService
 * @description Coordinates identification validation and secure credential verification processes.
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * @method validateUser
   * @description Assesses whether provided plain text password credentials match stored hashes.
   * @param {string} username Target context identifier.
   * @param {string} pass Plain text challenge password.
   * @returns {Promise<any>} Explicit safe user data stripped of private properties if correct.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    // 1. Fetch user from database
    const user = await this.usersService.findByUsername(username);

    console.log('--- AUTH COMPILER CHECK ---');
    console.log('User found in DB:', user ? 'YES' : 'NO');

    if (user) {
      // 2. Run the bcrypt comparison check
      const isMatch = await bcrypt.compare(pass, user.password);
      console.log('Password submitted matches hash:', isMatch ? 'YES' : 'NO');

      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  /**
   * @method login
   * @description Finalizes successful authentication transactions by wrapping credential details into signed JWT strings.
   * @param {any} user Explicit user instance to tokenize.
   * @returns {Promise<{ access_token: string }>} Signed access token object payload wrapper.
   */
  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.user_id,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
