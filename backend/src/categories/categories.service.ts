import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

/**
 * @class CategoriesService
 * @author [LONGOLOL EMURIA MOHAMUD]
 * @description Provides the data access and business layer logic for system storage categories.
 */
@Injectable()
export class CategoriesService {
  /**
   * @constructor
   * @param {Repository<Category>} categoryRepository Injected TypeORM data access wrapper.
   */
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * @method create
   * @description Inserts a brand new category definition entry into the database tracking engine.
   * @param {Partial<Category>} categoryData Properties used to build the new category structure.
   * @returns {Promise<Category>} The saved database entity instance.
   */
  async create(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  /**
   * @method findAll
   * @description Collects all existing category records stored inside the system tables.
   * @returns {Promise<Category[]>} Resolution array containing all category elements.
   */
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  /**
   * @method findOne
   * @description Targets and extracts a single specific category record matching the provided index key.
   * @param {number} id Unique database record pointer.
   * @returns {Promise<Category>} Located category profile details.
   * @throws {NotFoundException} If no record matches the target parameter.
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { category_id: id } });
    if (!category) {
      throw new NotFoundException(`Category matching ID ${id} was not located.`);
    }
    return category;
  }

  /**
   * @method update
   * @description Alters and updates structural properties on an existing category description record.
   * @param {number} id Target record pointer to alter.
   * @param {Partial<Category>} updateData Value maps containing fields to apply.
   * @returns {Promise<Category>} Up-to-date representation of modified entry details.
   */
  async update(id: number, updateData: Partial<Category>): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateData);
    return this.categoryRepository.save(category);
  }

  /**
   * @method remove
   * @description Drops a target category listing row from the persistence tables.
   * @param {number} id Targeted category record pointer to clear.
   * @returns {Promise<void>} Resolves successfully when row deletion concludes.
   */
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}