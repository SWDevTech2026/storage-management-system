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
 * @description Controls network traffic entry workflows pointing at inventory assets modification routines.
 */
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

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

  @Get()
  async findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.itemsService.update(+id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
