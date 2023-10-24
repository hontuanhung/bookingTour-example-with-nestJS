import { Query } from 'mongoose';

export default class APIFeatures {
  queryModel: Query<Document[], Document>;
  queryString: any;
  constructor(queryModel: Query<Document[], Document>, queryString: any) {
    this.queryModel = queryModel;
    this.queryString = queryString;
  }

  filter() {
    const queryObj: any = { ...this.queryString }; //clone req.query
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.queryModel = this.queryModel.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.queryModel = this.queryModel.sort(sortBy);
    } else {
      this.queryModel = this.queryModel.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.replace(/,/g, ' ');
      this.queryModel = this.queryModel.select(fields);
    } else {
      this.queryModel = this.queryModel.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.queryModel = this.queryModel.skip(skip).limit(limit);
    return this;
  }
}
