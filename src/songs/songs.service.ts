import { Inject, Injectable, Scope } from '@nestjs/common';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDTO } from './dto/update-song-dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';

@Injectable({scope:Scope.TRANSIENT})
export class SongsService {
     constructor(
        @InjectRepository(Song) 
        private songsRepository: Repository<Song>,
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>
       ){ }


    async create(songDTO:CreateSongDTO):Promise<Song>{

        // save the song to database
        const song = new Song()
        song.title = songDTO.title;
        song.duration = songDTO.duration;
        song.lyrics = songDTO.lyrics;
        song.release_date = songDTO.release_date;

        const artists = await this.artistRepository.findBy({id: In(songDTO.artists)});
        song.artists = artists;

        return  await this.songsRepository.save(song);
        
    }

    findAll():Promise<Song[]>{
        return this.songsRepository.find()
    }

    findOne(id:number):Promise<Song | null>{
        return this.songsRepository.findOneBy({id})
    }

    delete(id:number):Promise<DeleteResult>{
        return this.songsRepository.delete(id)
    }
    update(id:number, recordToUpdate:UpdateSongDTO):Promise<UpdateResult>{
        return this.songsRepository.update(id,recordToUpdate)
    }

 
    async paginate(options:IPaginationOptions):Promise<Pagination<Song>>{
        // box<T>(item: T) --> box<string>("hello"); That tells the function: “You’re working with a string.”
        const queryBuilder = this.songsRepository.createQueryBuilder('c');
        queryBuilder.orderBy('c.release_date','DESC')
        return paginate<Song>(queryBuilder,options)
    }
}