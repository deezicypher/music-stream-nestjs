import { Inject, Injectable } from '@nestjs/common';
import { DevConfigService } from './common/providers/DevConfigService';

@Injectable()
export class AppService {
  constructor (private devConfigService: DevConfigService,
    @Inject('CONFIG')
    private config: {port:string}
  ) {}
  getHello(): string {
    return `Hello Deezi! you're running on host ${this.devConfigService.getDBHOST()} port ${this.config.port}`
  }
}
