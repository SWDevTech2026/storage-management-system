import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';

/**
 * @class ItemsService
 * @author [Longolol Emuria Mohamud]
 * @description Performs data alteration, listing, extraction, and update management rules for inventory items.
 */
@Injectable()
export class ItemsService {
  /**
   * @constructor
   * @param {Repository<Item>} itemRepository Injected relational repository abstraction.
   */
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  /**
   * @method create
   * @description Saves a new stock item record bound to its category and staff metadata footprints.
   * @param {Partial<Item>} itemData Properties used to construct the new inventory entry.
   * @returns {Promise<Item>} The newly saved item database entity instance.
   */
  async create(itemData: Partial<Item>): Promise<Item> {
    const item = this.itemRepository.create(itemData);
    return this.itemRepository.save(item);
  }

  /**
   * @method findAll
   * @description Gathers full storage inventory collections, pulling along basic category mapping descriptors.
   * @returns {Promise<Item[]>} Array containing all located item records.
   */
  async findAll(): Promise<Item[]> {
    return this.itemRepository.find({
      relations: { category: true },
    });
  }

  /**
   * @method findOne
   * @description Fetches details of a specific item matching an exact record key.
   * @param {number} id Unique primary database record pointer.
   * @returns {Promise<Item>} Located item profile details with mapped relationships.
   * @throws {NotFoundException} If no record matches the target parameter.
   */
  async findOne(id: number): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { item_id: id },
      relations: { category: true },
    });
    if (!item) {
      throw new NotFoundException(
        `Item with identifying label ID ${id} was not found.`,
      );
    }
    return item;
  }

  /**
   * @method update
   * @description Updates parameters on an active stock registry tracking item.
   * @param {number} id Target record pointer to alter.
   * @param {Partial<Item>} updateData Value maps containing fields to apply.
   * @returns {Promise<Item>} Up-to-date representation of modified entry details.
   */
  async update(id: number, updateData: Partial<Item>): Promise<Item> {
    const item = await this.findOne(id);
    Object.assign(item, updateData);
    return this.itemRepository.save(item);
  }

  /**
   * @method remove
   * @description Completely drops an explicit tracking inventory entry out of tracking scope.
   * @param {number} id Targeted item record pointer to delete from the database.
   * @returns {Promise<void>} Resolves successfully when the entity removal concludes.
   */
  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.itemRepository.remove(item);
  }

  /**
   * @method getInventoryMetrics
   * @description Computes comprehensive warehouse business logic values, tracking global net worth and low inventory flags.
   * @returns {Promise<{ totalValuation: number, lowStockCount: number }>} Quantified inventory monitoring metrics payload.
   */
  async getInventoryMetrics(): Promise<{ totalValuation: number; lowStockCount: number }> {
    const allItems = await this.itemRepository.find();
    
    let totalValuation = 0;
    let lowStockCount = 0;

    for (const item of allItems) {
      if (item.price && item.quantity) {
        totalValuation += Number(item.price) * item.quantity;
      }
      if (item.quantity < 5) {
        lowStockCount++;
      }
    }

    return { totalValuation, lowStockCount };
  }
}