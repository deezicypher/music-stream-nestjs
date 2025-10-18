import { Inject, Injectable, Scope } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable({scope:Scope.TRANSIENT})
export class SongsService {
     constructor(
        @InjectRepository(Song) 
        private songsRepository: Repository<Song>   ){ }
    private readonly songs:any[] = [];

   

    create(songDTO:CreateSongDTO):Promise<Song>{

        // save the song to database
        const song = new Song()
        song.title = songDTO.title;
        song.artists = songDTO.artists;
        song.duration = songDTO.duration;
        song.lyrics = songDTO.lyrics;
        song.release_date = songDTO.release_date;

        return  this.songsRepository.save(song);
        
    }

    findAll():Promise<Song[]>{
        return this.songsRepository.find()
    }
}