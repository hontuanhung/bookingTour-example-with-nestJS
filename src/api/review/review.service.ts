import { Tour } from './../tours/model/tour.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './model/review.schema';
import APIFeatures from 'src/ultils/apiFeatures';
import { ListAllEntities } from 'src/ultils/list-all-entities';
import { ResponsePattern } from 'src/ultils/response-type';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(Tour.name) private tourModel: Model<Tour>,
  ) {}

  async create(
    tourId: string,
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ResponsePattern<ReviewDocument>> {
    Object.assign(createReviewDto, {
      tour: tourId,
      user: userId,
      createdAt: new Date(),
    });
    const doc: ReviewDocument = await this.reviewModel.create(createReviewDto);
    return { status: 'success', doc };
  }

  async findAll(
    query: ListAllEntities,
    tourId?: string,
  ): Promise<ResponsePattern<Document>> {
    let filter: object = {};
    if (tourId) {
      filter = { tour: tourId };
    }
    const features: APIFeatures = new APIFeatures(
      this.reviewModel.find(filter),
      query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs: Document[] = await features.queryModel.populate('tour');
    return { status: 'success', results: docs.length, docs };
  }

  async findOne(id: string): Promise<ResponsePattern<ReviewDocument>> {
    const doc: ReviewDocument | null = await this.reviewModel.findById(id);
    if (!doc) {
      throw new NotFoundException();
    }
    return { status: 'success', doc };
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ResponsePattern<ReviewDocument>> {
    const doc: ReviewDocument | any = await this.reviewModel.findByIdAndUpdate(
      id,
      updateReviewDto,
      { new: true },
    );
    if (!doc) {
      throw new NotFoundException();
    }
    doc.calcAverageRatings(doc.tour, this.tourModel);
    return { status: 'success', doc };
  }

  async remove(id: string): Promise<ResponsePattern<ReviewDocument>> {
    const doc: ReviewDocument | null =
      await this.reviewModel.findByIdAndDelete(id);
    if (!doc) {
      throw new NotFoundException();
    }
    return { status: 'success' };
  }
}
