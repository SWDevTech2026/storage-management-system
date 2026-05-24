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
 * @author [Longolol Emuria Mohamud]
 * @description Represents an inventory asset stock item tracked by the management software system.
 */
@Entity('items')
export class Item {
  /**
   * @property item_id
   * @type {number}
   * @description The unique primary key identifier for the inventory item.
   */
  @PrimaryGeneratedColumn()
  item_id: number;

  /**
   * @property item_name
   * @type {string}
   * @description The descriptive name label used to identify the stock item.
   */
  @Column({ length: 100 })
  item_name: string;

  /**
   * @property category_id
   * @type {number}
   * @description Foreign key referencing the associated category identifier.
   */
  @Column({ nullable: true })
  category_id: number;

  /**
   * @property quantity
   * @type {number}
   * @description The current stock volume count available in the storage warehouse.
   */
  @Column({ default: 0 })
  quantity: number;

  /**
   * @property price
   * @type {number}
   * @description The commercial monetary unit cost of the asset.
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  /**
   * @property created_by
   * @type {number}
   * @description Foreign key tracking the administrator user who provisioned the item.
   */
  @Column({ nullable: true })
  created_by: number;

  /**
   * @property created_at
   * @type {Date}
   * @description Timestamp indicating the exact moment the item was logged into the registry.
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * @property category
   * @type {Category}
   * @description Relational many-to-one mapping pointing to the Category entity grouping.
   */
  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  /**
   * @property creator
   * @type {User}
   * @description Relational many-to-one mapping tracking account profile identity metadata.
   */
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator: User;
}