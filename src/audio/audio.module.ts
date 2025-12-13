import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports:[
    BullModule.registerQueue({
    name: 'audio-queue',
    }),
  ],
  controllers: [AudioController]
})
export class AudioModule {}
