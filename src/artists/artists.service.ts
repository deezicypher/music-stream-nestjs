import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { In, Repository } from 'typeorm';
import { CreateArtistDTO } from './dto/create-artist-dto';
import { User } from 'src/users/user.entity';
import { Song } from 'src/songs/song.entity';

@Injectable()
export class ArtistsService {
  
    constructor(
          @InjectRepository(Artist)
        private artistRepo: Repository<Artist>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Song)
        private songRepo: Repository<Song>  
        ){}

    async create(artistDTO:CreateArtistDTO):Promise<Artist>{
        const artist = new Artist()
        const user = await this.userRepo.findOneBy({id:artistDTO.user})
         if (!user) {
                    throw new NotFoundException('User not found');
                    }
        artist.user = user

        if(artistDTO.songs?.length){
            const songs = await this.songRepo.findBy({ id: In(artistDTO.songs) });
            artist.songs = songs;
        }

        return this.artistRepo.save(artist)
    }
    async findArtist(userId:number):Promise<Artist | null>{
       return this.artistRepo.findOneBy({user:{id:userId}})
        
    }
}
