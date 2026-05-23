import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Item } from '../../items/entities/item.entity';

/**
 * @class Category
 * @description Represents a product grouping category within the storage management system.
 */
@Entity('categories')
export class Category {
  /**
   * @property category_id
   * @type {number}
   * @description Unique primary identity key for the category record.
   */
  @PrimaryGeneratedColumn()
  category_id: number;

  /**
   * @property category_name
   * @type {string}
   * @description Descriptive name label used to identify the category.
   */
  @Column({ length: 100 })
  category_name: string;

  /**
   * @property items
   * @type {Item[]}
   * @description Array collection of items assigned to this specific storage category.
   */
  @OneToMany(() => Item, (item) => item.category)
  items: Item[];
}
