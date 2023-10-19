import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import configEnv from 'configEnv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { IUser } from 'src/users/model/user.interface';
import util from 'util';

@Injectable()
export class ProtecMiddleware implements NestMiddleware {
  //   constructor(
  //     @Inject('USER_MODEL')
  //     private userModel: Model<IUser>,
  //   ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //     let token: string = '';
    //     if (
    //       req.headers.authorization &&
    //       req.headers.authorization.startsWith('Bearer')
    //     ) {
    //       token = req.headers.authorization.split(' ')[1];
    //     }
    //     if (!token || token === 'null') {
    //       throw new HttpException(
    //         'You are not logged in! Please log in to get access.',
    //         HttpStatus.UNAUTHORIZED,
    //       );
    //     }

    //     // 2) Verification token
    //     const decoded: any = util.promisify(jwt.verify)(
    //       token,
    //       configEnv.JWT_SECRET,
    //     );

    //     // 3) Check if user still exists
    //     const currentUser: any = this.userModel
    //       .findById(decoded.id)
    //       .select('+userJWTs');

    //     if (!currentUser) {
    //       throw new HttpException(
    //         'The user belonging to this token does not longer exist.',
    //         HttpStatus.UNAUTHORIZED,
    //       );
    //     }

    //     if (!currentUser.userJWTs.includes(token)) {
    //       throw new HttpException('Token does not match', HttpStatus.UNAUTHORIZED);
    //     }

    //     // 4) Check if user changed password after the token was issued
    //     if (currentUser.changedPasswordAfter(decoded.iat)) {
    //       throw new HttpException(
    //         'User recently changed password! Please log in again.',
    //         HttpStatus.UNAUTHORIZED,
    //       );
    //     }

    //     // Grant access to protected route
    console.log('middleware using success');
    Object.assign(req, { user: 'fsnjskfbgnk' });
    next();
  }
}
