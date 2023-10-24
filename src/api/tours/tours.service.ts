import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Connection, Model } from 'mongoose';
import { Tour, TourDocument } from './model/tour.schema';
import APIFeatures from 'src/ultils/apiFeatures';
import { ListAllEntities } from '../../ultils/list-all-entities';
import { ResponsePattern } from 'src/ultils/response-type';
import { DataPattern } from './model/get-data-pattern';

@Injectable()
export class ToursService {
  constructor(
    @InjectConnection()
    private connect: Connection,

    @InjectModel(Tour.name)
    private tourModel: Model<Tour>,
  ) {}

  async create(
    createTourDto: CreateTourDto,
  ): Promise<ResponsePattern<TourDocument>> {
    const doc: TourDocument = await this.tourModel.create(createTourDto);
    return { status: 'success', doc };
  }

  async findAll(
    query?: ListAllEntities,
  ): Promise<{ status: string; result: number; tours: Document[] }> {
    const features: APIFeatures = new APIFeatures(this.tourModel.find(), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours: Document[] = await features.queryModel;
    return { status: 'success', result: tours.length, tours };
  }

  async findOne(id: string): Promise<ResponsePattern<TourDocument>> {
    const doc: TourDocument | null = await this.tourModel.findById(id);

    if (!doc) {
      throw new NotFoundException();
    }
    return { status: 'success', doc };
  }

  async getTourStats(): Promise<{ status: 'success'; stats: any }> {
    const stats: any = await this.tourModel.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    return { status: 'success', stats };
  }

  async getMonthlyPlan(year: number): Promise<{
    status: string;
    results: number;
    data: any;
  }> {
    const plan = await this.tourModel.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: { $substr: ['$startDates', 5, 2] },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
      {
        $limit: 12,
      },
    ]);
    return {
      status: 'success',
      results: plan.length,
      data: {
        plan,
      },
    };
  }

  async getToursWithIn(
    distance: number,
    latlng: string,
    unit: string,
  ): Promise<DataPattern> {
    const [lat, lng] = latlng.split(',');

    const radius: number =
      unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    console.log(radius);
    if (!lat || !lng) {
      throw new BadRequestException(
        'Please provide latitute and longitude in the format lat,lng.',
      );
    }

    const tours: TourDocument[] = await this.tourModel.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    return {
      status: 'success',
      results: tours.length,
      data: {
        data: tours,
      },
    };
  }

  async getDistances(latlng: string, unit: string): Promise<DataPattern> {
    const [lat, lng] = latlng.split(',');

    const multiplier: number = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
      throw new BadRequestException(
        'Please provide latitute and longitude in the format lat,lng.',
      );
    }

    const distances: any = await this.tourModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    return { status: 'success', data: distances };
  }

  async update(
    id: string,
    updateTourDto: UpdateTourDto,
  ): Promise<ResponsePattern<TourDocument>> {
    const doc: TourDocument | null = await this.tourModel.findByIdAndUpdate(
      id,
      updateTourDto,
      { new: true },
    );
    if (!doc) {
      throw new NotFoundException();
    }
    return { status: 'success', doc };
  }

  async remove(id: number): Promise<ResponsePattern<TourDocument>> {
    const tour: TourDocument | null =
      await this.tourModel.findByIdAndDelete(id);
    if (!tour) {
      throw new NotFoundException();
    }
    return { status: 'success' };
  }
}
