import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
    private readonly songs:any[] = [];

    create(song){
        // save the song to database
        this.songs.push(song);
        return this.songs;
        
    }

    findAll(){
        // fetch songs from database
        return this.songs;
    }
}