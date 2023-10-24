import { ReviewService } from './../review/review.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourDocument } from './model/tour.schema';
import { ListAllEntities } from '../../ultils/list-all-entities';
import { ResponsePattern } from 'src/ultils/response-type';
import { DataPattern } from './model/get-data-pattern';
import { Protect } from 'src/share/consants/protect.constant';
import { Roles } from 'src/share/decorator_custom/roles.decorator';
import { ReviewDocument } from '../review/model/review.schema';
import { CreateReviewDto } from '../review/dto/create-review.dto';

@Controller('/api/v1/tours')
export class ToursController {
  constructor(
    private readonly toursService: ToursService,
    private readonly reviewService: ReviewService,
  ) {}

  @Post()
  @Protect()
  @Roles('lead-guide', 'admin')
  async create(
    @Body() createTourDto: CreateTourDto,
  ): Promise<ResponsePattern<TourDocument>> {
    return this.toursService.create(createTourDto);
  }

  @Post('/:tourId/reviews')
  @Protect()
  @Roles('user', 'admin')
  async createReview(
    @Param('tourId') tourId: string,
    @Req() req: any,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ResponsePattern<ReviewDocument>> {
    return this.reviewService.create(tourId, req.payload.id, createReviewDto);
  }

  @Get()
  async findAll(
    @Query() query: ListAllEntities,
  ): Promise<{ tours: Document[] }> {
    console.log(query);
    return this.toursService.findAll(query);
  }

  @Get('/:tourId/reviews')
  async getReviews(
    @Param('tourId') id: string,
    @Query() query: ListAllEntities,
  ): Promise<ResponsePattern<Document>> {
    return this.reviewService.findAll(query, id);
  }

  @Get('/top-5-cheap')
  async findTopTour(): Promise<ResponsePattern<TourDocument>> {
    const query: ListAllEntities = {
      limit: '5',
      sort: '-ratingsAverage,price',
      fields: 'name,price,ratingsAverage,summary,difficulty',
    };
    return this.toursService.findAll(query);
  }

  @Get('/tour-stats')
  async getTourStats() {
    return this.toursService.getTourStats();
  }

  @Get('/tours-within/:distance/center/:latlng/unit/:unit')
  async getToursWithin(
    @Param('distance') distance: string,
    @Param('latlng') latlng: string,
    @Param('unit') unit: string,
  ): Promise<DataPattern> {
    console.log(distance, latlng, unit);
    return this.toursService.getToursWithIn(+distance, latlng, unit);
  }

  @Get('/distances/:latlng/unit/:unit')
  async getDistances(
    @Param('latlng') latlng: string,
    @Param('unit') unit: string,
  ): Promise<DataPattern> {
    return this.toursService.getDistances(latlng, unit);
  }

  @Get('/monthly-plan/:year')
  @Protect()
  @Roles('admin', 'guide', 'lead-guide')
  async getMonthlyPlan(@Param('year') year: string): Promise<{
    status: string;
    results: number;
    data: any;
  }> {
    return this.toursService.getMonthlyPlan(+year);
  }

  @Get('/:id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponsePattern<TourDocument>> {
    return this.toursService.findOne(id);
  }

  @Patch('/:id')
  @Protect()
  @Roles('admin', 'lead-guide')
  update(
    @Param('id') id: string,
    @Body() updateTourDto: UpdateTourDto,
  ): Promise<ResponsePattern<TourDocument>> {
    return this.toursService.update(id, updateTourDto);
  }

  @Delete('/:id')
  @Protect()
  @Roles('admin', 'lead-guide')
  remove(@Param('id') id: string): Promise<ResponsePattern<TourDocument>> {
    return this.toursService.remove(+id);
  }
}
