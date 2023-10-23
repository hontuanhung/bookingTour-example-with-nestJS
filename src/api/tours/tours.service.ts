import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Connection, Model } from 'mongoose';
import { Tour, TourDocument } from './model/tour.schema';

@Injectable()
export class ToursService {
  constructor(
    @InjectConnection()
    private connect: Connection,

    @InjectModel(Tour.name)
    private tourModel: Model<Tour>,
  ) {}

  async create(createTourDto: CreateTourDto) {
    const tour: TourDocument = await this.tourModel.create(createTourDto);
    return { status: 'success', tour };
  }

  findAll() {
    return `This action returns all tours`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tour`;
  }

  update(id: number, updateTourDto: UpdateTourDto) {
    updateTourDto;
    return `This action updates a #${id} tour`;
  }

  remove(id: number) {
    return `This action removes a #${id} tour`;
  }
}
