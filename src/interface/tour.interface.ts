import { Document } from 'mongoose';

export enum DIFFICULTY {
  EASY = 'easy',
  MEDIUM = 'medium',
  DIFFICULT = 'difficult',
}

export type Location = {
  type: object;
  coordinates: number[];
  address: string;
  description: string;
};

export interface ITour extends Document {
  name: string;
  duration: number;
  maxGroupSize: 15;
  difficulty: DIFFICULTY;
  slug: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscounty: number;
  summary: string;
  descriptiong: string;
  imageCover: string;
  images: string[];
  createdAt: Date;
  startDates: Date[];
  startLocation: Location;
  lacations: Location[];
  guide: string;
}
