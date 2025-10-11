import { Inject, Injectable, Scope } from '@nestjs/common';
import { type Connection } from 'src/common/constants/connection';

@Injectable({scope:Scope.TRANSIENT})
export class SongsService {
    private readonly songs:any[] = [];

    constructor(
        @Inject('CONNECTION')
        connection: Connection
    ){ console.log(`Connection string ${connection.DB}`)}

    create(song){
        // save the song to database
        this.songs.push(song);
        return this.songs;
        
    }

    findAll(){
        // fetch songs from database
        // throw new Error('Error in DB while fetching records')
        return this.songs;
    }
}