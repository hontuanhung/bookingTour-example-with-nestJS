import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Model, Types } from 'mongoose';
import { User } from 'src/api/users/model/user.schema';
import slugify from 'slugify';
import { Review } from 'src/api/review/model/review.schema';

export type TourDocument = HydratedDocument<Tour>;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false })
export class Tour extends Document {
  @Prop({ unique: true, trim: true })
  name!: string;

  @Prop()
  slug!: string;

  @Prop()
  duration!: number;

  @Prop()
  maxGroupSize!: number;

  @Prop()
  difficulty!: string;

  @Prop({
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val: number) => val.toFixed(1),
  })
  ratingsAverage!: number;

  @Prop({ default: 0 })
  ratingsQuantity!: number;

  @Prop()
  price!: number;

  @Prop({
    validate: {
      validator: function (this: Tour, val: number) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price',
    },
  })
  priceDiscount!: number;

  @Prop({ trim: true })
  summary!: string;

  @Prop({ trim: true })
  description!: string;

  @Prop()
  imageCover!: string;

  @Prop([String])
  images!: string[];

  @Prop({ default: Date.now(), select: false })
  createdAt!: Date;

  @Prop([Date])
  startDates!: Date[];

  @Prop({ default: false })
  secretTour!: string;

  // @Prop({
  //   type: {
  //     type: {
  //       type: String,
  //       enum: ['Point'],
  //     },
  //     coordinates: [Number],
  //     address: String,
  //     description: String,
  //   },
  //   // required: false,
  // })
  // startLocation!: object;

  @Prop({
    type: {
      type: Object,
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
  })
  locations!: Location[];

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  guides!: User[];
}

export const TourSchema = SchemaFactory.createForClass(Tour);

TourSchema.index({ price: 1, ratingsAverage: -1 });
TourSchema.index({ slug: 1 });
TourSchema.index({ startLocation: '2dsphere' });

TourSchema.virtual('reviews', {
  ref: Review.name,
  localField: '_id',
  foreignField: 'tour',
});

TourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

TourSchema.pre(/^find/, function (this: Model<Tour>) {
  this.find({ secretTour: { $ne: true } });
});

TourSchema.pre(/^find/, function (this: Model<Tour>) {
  this.populate('guides', '-__v -passwordChangedAt');
});
