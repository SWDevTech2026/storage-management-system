import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

/**
 * @class Item
 * @description Represents an inventory asset stock item tracked by the management software system.
 */
@Entity('items')
export class Item {
  /**
   * @property item_id
   * @type {number}
   */
  @PrimaryGeneratedColumn()
  item_id: number;

  /**
   * @property item_name
   * @type {string}
   */
  @Column({ length: 100 })
  item_name: string;

  @Column({ nullable: true })
  category_id: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ nullable: true })
  created_by: number;

  /**
   * @property created_at
   * @type {Date}
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Relationships
  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator: User;
}
