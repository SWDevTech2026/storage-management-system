import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

/**
 * @class CategoriesController
 * @author [Longolol Emuria Mohamud]
 * @description Exposes structural category CRUD access paths to active system clients.
 */
@Controller('categories')
export class CategoriesController {
  /**
   * @constructor
   * @param {CategoriesService} categoriesService Injected backend data processing layer service.
   */
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * @method create
   * @description Handles HTTP POST requests to insert a new stock category classification.
   * @route POST /categories
   * @param {Object} body Data payload detailing the new category configurations.
   */
  @Post()
  async create(@Body() body: { category_name: string }) {
    return this.categoriesService.create(body);
  }

  /**
   * @method findAll
   * @description Handles HTTP GET requests to extract all categorized data rows.
   * @route GET /categories
   */
  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  /**
   * @method findOne
   * @description Handles HTTP GET requests to target a unique entry by primary index key.
   * @route GET /categories/:id
   * @param {string} id Unique numerical path variable identity string.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  /**
   * @method update
   * @description Handles HTTP PATCH requests to modify text labels within an active tracking record.
   * @route PATCH /categories/:id
   * @param {string} id Target primary identity index parameter.
   * @param {Object} body Value modifications payload tracking specific fields to alter.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { category_name: string },
  ) {
    return this.categoriesService.update(+id, body);
  }

  /**
   * @method remove
   * @description Handles HTTP DELETE requests to clear out a target structural classification record.
   * @route DELETE /categories/:id
   * @param {string} id Targeted key token indicating the row execution selection.
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}