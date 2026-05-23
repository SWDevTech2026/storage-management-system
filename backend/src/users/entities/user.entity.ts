import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * @class User
 * @description Represents a system user entity mapping directly to the database 'users' table.
 */
@Entity('users')
export class User {
  /**
   * @property user_id
   * @type {number}
   * @description Unique primary key for the user.
   */
  @PrimaryGeneratedColumn()
  user_id: number;

  /**
   * @property username
   * @type {string}
   * @description Unique alphanumeric identity name.
   */
  @Column({ unique: true, length: 50 })
  username: string;

  /**
   * @property email
   * @type {string}
   * @description Optional unique contact email string.
   */
  @Column({ unique: true, length: 100, nullable: true })
  email: string;

  /**
   * @property password
   * @type {string}
   * @description Securely hashed password string.
   */
  @Column({ length: 255 })
  password: string;

  /**
   * @property created_at
   * @type {Date}
   * @description Timestamp indicating account registration moment.
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'varchar', default: 'user' })
  role: string; // Will store either 'admin' or 'user'
}
