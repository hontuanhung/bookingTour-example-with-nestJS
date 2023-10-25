import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Model } from 'mongoose';
import { Tour } from 'src/api/tours/model/tour.schema';
import { User } from 'src/api/users/model/user.schema';
import { IReview } from 'src/interface/review.interface';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false })
export class Review extends Document implements IReview {
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
