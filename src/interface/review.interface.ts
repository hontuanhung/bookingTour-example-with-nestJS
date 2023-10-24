import { Model } from 'mongoose';
import { Review } from 'src/api/review/model/review.schema';
import { Tour } from 'src/api/tours/model/tour.schema';
import { User } from 'src/api/users/model/user.schema';

export interface IReview {
  review: string;
  rating: number;
  createdAt: Date;
  r?: any;
  tour: Tour;
  user: User;
}

export interface ReviewModel extends Model<Review> {
  constructor?: {
    calcAverageRatings(tour: Tour): Promise<any>;
  };
}
