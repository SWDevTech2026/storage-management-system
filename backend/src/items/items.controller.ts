import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemsService } from './items.service';

/**
 * @class ItemsController
 * @author [Longolol Emuria Mohamud]
 * @description Controls network traffic entry workflows pointing at inventory assets modification routines.
 */
@Controller('items')
export class ItemsController {
  /**
   * @constructor
   * @param {ItemsService} itemsService Injected operational data flow domain service.
   */
  constructor(private readonly itemsService: ItemsService) {}

  /**
   * @method getMetrics
   * @description Custom endpoint designed to pull calculated warehouse stock metrics and analytics values.
   * @route GET /items/analytics/metrics
   */
  @Get('analytics/metrics')
  async getMetrics() {
    return this.itemsService.getInventoryMetrics();
  }

  /**
   * @method create
   * @description Receives network data blocks to provision and log a brand new stock tracking row.
   * @route POST /items
   * @param {Object} body Data payload detailing specifications of the new item asset.
   */
  @Post()
  async create(
    @Body()
    body: {
      item_name: string;
      category_id: number;
      quantity: number;
      price: number;
      created_by?: number;
    },
  ) {
    return this.itemsService.create(body);
  }

  /**
   * @method findAll
   * @description Gathers full storage catalog collections currently recorded within systems data spaces.
   * @route GET /items
   */
  @Get()
  async findAll() {
    return this.itemsService.findAll();
  }

  /**
   * @method findOne
   * @description Pulls unique profile metadata matching an explicit record numerical token.
   * @route GET /items/:id
   * @param {string} id Structural parameters key token indicator.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  /**
   * @method update
   * @description Alters specified parameters across a target entry row.
   * @route PATCH /items/:id
   * @param {string} id Parameter identifier targeting the item row.
   * @param {any} body Modified value fields mapping schema to apply.
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.itemsService.update(+id, body);
  }

  /**
   * @method remove
   * @description Drops an explicit record row permanently out of data processing loops.
   * @route DELETE /items/:id
   * @param {string} id Structural parameter key token targeting the deletion row.
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}