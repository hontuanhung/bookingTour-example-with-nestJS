import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTwitterDto } from './dto/create-twitter.dto';
import { UpdateTwitterDto } from './dto/update-twitter.dto';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, map } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Tour } from '../tours/model/tour.schema';
import { createTweet } from '../../ultils/twitter/twitterApiConfig';
import { postTweet } from 'src/ultils/twitter/consuming-a-steam';

@Injectable()
export class TwitterService {
  constructor(private readonly httpService: HttpService) {}

  create() {
    const data = 'test leen';
    // createTweet(data);

    postTweet(data);
    return data;
  }

  findAll(): Observable<AxiosResponse<Tour[]>> {
    // main();

    const tours = this.httpService
      .get(`http://localhost:8000/api/v1/tours`)
      .pipe(map((res) => res.data))
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
    return tours;
  }

  findOne(id: number) {
    return `This action returns a #${id} twitter`;
  }

  update(id: number, updateTwitterDto: UpdateTwitterDto) {
    return `This action updates a #${id} twitter`;
  }

  remove(id: number) {
    return `This action removes a #${id} twitter`;
  }
}
