import { Module } from '@nestjs/common';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tour, TourSchema } from './model/tour.schema';
import { ReviewService } from '../review/review.service';
import { Review, ReviewSchema } from '../review/model/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ToursController],
  providers: [ToursService, ReviewService],
})
export class ToursModule {}
