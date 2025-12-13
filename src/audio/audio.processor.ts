import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import type { Job } from "bull";

@Processor("audio-queue")
export class AudioProcessor {
    private logger = new Logger(AudioProcessor.name);


    @Process("convert")
    handleConvert(job: Job) {
        this.logger.debug("start converting wav file to mp3");
        this.logger.debug(job.data);
        this.logger.debug("file converted successfully");
}

}