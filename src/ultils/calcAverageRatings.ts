import { Model, Types } from 'mongoose';
import { Review } from 'src/api/review/model/review.schema';
import { Tour } from 'src/api/tours/model/tour.schema';

export const calcAverageRatings = async function (
  tourId: string,
  reviewModel: Model<Review>,
  tourModel: Model<Tour>,
) {
  const stats: any = await reviewModel.aggregate([
    { $match: { tour: new Types.ObjectId(tourId) } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await tourModel.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await tourModel.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};
