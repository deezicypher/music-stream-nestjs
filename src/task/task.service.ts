import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name)

//    @Cron('*/10 * * * * *')
    @Cron(CronExpression.EVERY_10_SECONDS)
    myCronTask(){
        this.logger.debug('Cron task called')
    }
}
