import { IUser } from './user.interface';

export interface ITour {
  start: number;
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  imageCover: string;
  images: string;
  createdAt: Date;
  startDates: Date;
  secretTour: boolean;
  startLocation: Location;
  location: Location[];
  guides: IUser[];
}
