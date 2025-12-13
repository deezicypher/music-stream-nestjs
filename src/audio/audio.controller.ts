import { InjectQueue } from '@nestjs/bull';
import { Controller, Post } from '@nestjs/common';
import type {Queue} from 'bull';

@Controller('audio')
export class AudioController {
    constructor(
        @InjectQueue('audio-queue')
        private readonly audioQueue:Queue
    ){}

    @Post("convert")
        async convert() {
        await this.audioQueue.add("convert", {
        file: "sample.wav",
        id:1
        });
        }
}
