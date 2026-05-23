import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

/**
 * @class UsersService
 * @description Service containing business and database persistence logic regarding application Users.
 */
@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * @method onModuleInit
   * @description Automatically executed on startup to guarantee an admin account exists.
   */
  async onModuleInit() {
    // 1. Completely wipe out any broken old hashes for 'admin'
    await this.userRepository.delete({ username: 'admin' });

    // 2. Build a fresh admin record with our reliable bcryptjs library
    console.log('--- GENERATING CLEAN NATIVE SECURITY CREDENTIALS ---');
    const securePassword = await bcrypt.hash('admin123', 10);

    const freshAdmin = this.userRepository.create({
      username: 'admin',
      email: 'admin@storage.com',
      password: securePassword,
      role: 'admin',
    });

    await this.userRepository.save(freshAdmin);
    console.log(
      '--- SECURITY MATRIX RESET COMPLETE: Account "admin" with "admin123" is live. ---',
    );
  }

  /**
   * @method findByUsername
   * @description Retrieves a single user profile from the database based on username string.
   * @param {string} username Unique username indicator.
   * @returns {Promise<User | null>} User record if located.
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * @method create
   * @description Standardizes and registers a new User profile with a safely hashed password.
   * @param {Partial<User>} userData Configuration properties for new target user.
   * @returns {Promise<User>} Database record representation of newly registered user.
   * @throws {ConflictException} If the chosen username is already registered.
   */
  async create(userData: Partial<User>): Promise<User> {
    // 1. Enforce that a password must be provided during creation
    if (!userData.password) {
      throw new Error(
        'A valid password must be provided for user registration.',
      );
    }

    const existing = await this.findByUsername(userData.username || '');
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const newUser = this.userRepository.create(userData);

    // 2. TypeScript now knows userData.password is guaranteed to be a string here!
    newUser.password = await bcrypt.hash(userData.password, 10);

    return this.userRepository.save(newUser);
  }
}
