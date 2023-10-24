import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ListAllEntities } from 'src/ultils/list-all-entities';
import { Protect } from 'src/share/consants/protect.constant';
import { ResponsePattern } from 'src/ultils/response-type';
import { ReviewDocument } from './model/review.schema';
import { Roles } from 'src/share/decorator_custom/roles.decorator';

@Controller('/api/v1/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async findAll(
    @Query() query: ListAllEntities,
  ): Promise<ResponsePattern<Document>> {
    return this.reviewService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponsePattern<ReviewDocument>> {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @Protect()
  @Roles('user', 'admin')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ResponsePattern<ReviewDocument>> {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @Protect()
  @Roles('user', 'admin')
  async remove(
    @Param('id') id: string,
  ): Promise<ResponsePattern<ReviewDocument>> {
    return this.reviewService.remove(id);
  }
}
