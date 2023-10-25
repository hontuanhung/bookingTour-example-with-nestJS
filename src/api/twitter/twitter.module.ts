import { Injectable, Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import {
  HttpModule,
  HttpModuleOptions,
  HttpModuleOptionsFactory,
} from '@nestjs/axios';

@Injectable()
class HttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: 5000,
      maxRedirects: 5,
    };
  }
}

@Module({
  imports: [HttpModule],
  controllers: [TwitterController],
  providers: [TwitterService],
})
export class TwitterModule {}
