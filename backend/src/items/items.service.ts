import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';

/**
 * @class ItemsService
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
   */
  async create(itemData: Partial<Item>): Promise<Item> {
    const item = this.itemRepository.create(itemData);
    return this.itemRepository.save(item);
  }

  /**
   * @method findAll
   * @description Gathers full storage inventory collections, pulling along basic category mapping descriptors.
   */
  async findAll(): Promise<Item[]> {
    return this.itemRepository.find({
      relations: { category: true }, // Altered from array to object map syntax
    });
  }

  /**
   * @method findOne
   * @description Fetches details of a specific item matching an exact record key.
   */
  async findOne(id: number): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { item_id: id },
      relations: { category: true }, // Altered from array to object map syntax
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
   */
  async update(id: number, updateData: Partial<Item>): Promise<Item> {
    const item = await this.findOne(id);
    Object.assign(item, updateData);
    return this.itemRepository.save(item);
  }

  /**
   * @method remove
   * @description Completely drops an explicit tracking inventory entry out of tracking scope.
   */
  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.itemRepository.remove(item);
  }
}
