import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ITour } from 'src/interface/tour.interface';
import { IUser } from 'src/interface/user.interface';

export type TourDocument = HydratedDocument<Tour>;

export type Location = {
  type: object;
  coordinates: number[];
  address: string;
  description: string;
};

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false })
export class Tour {
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
      validator: function (this: ITour, val: number) {
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

  @Prop({
    type: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
  })
  startLocation!: object;

  @Prop({
    type: {
      type: Object,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
  })
  locations!: Location[];

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'User' }] })
  guides!: IUser[];
}

export const TourSchema = SchemaFactory.createForClass(Tour);
