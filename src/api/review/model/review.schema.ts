import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Tour } from 'src/api/tours/model/tour.schema';
import { User } from 'src/api/users/model/user.schema';
import { IReview, ReviewModel } from 'src/interface/review.interface';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false })
export class Review extends Document {
  @Prop()
  review!: string;

  @Prop()
  rating!: number;

  @Prop()
  createdAt!: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' })
  tour!: Tour;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user!: User;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

ReviewSchema.pre(/^find/, function (this: Model<Review>) {
  this.populate('user', 'name photo');
});

ReviewSchema.statics.calcAverageRatings = async function (
  tourId: string,
  Tour: Model<Tour>,
) {
  const stats: any = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

ReviewSchema.post('save', async function (this: Review & ReviewModel) {
  this.constructor.calcAverageRatings(this.tour);
});
