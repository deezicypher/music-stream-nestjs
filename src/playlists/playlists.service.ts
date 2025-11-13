import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { In, Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { CreatePlayListDto } from './dto/create-playlist-dto';

@Injectable()
export class PlaylistsService {
    constructor(
        @InjectRepository(Playlist)
        private playlistRepo: Repository<Playlist>,
        @InjectRepository(Song)
        private songRepo: Repository<Song>,
        @InjectRepository(User)
        private userRepo: Repository<User>
    ){}

    async create(playlistDto:CreatePlayListDto):Promise<Playlist>{
        const playlist = new Playlist()
        playlist.name = playlistDto.name;

        if(playlistDto.songs.length) {
            const songs = await this.songRepo.findBy({id: In(playlistDto.songs)})
          
            if(!songs || songs.length === 0 ){
                throw new NotFoundException(`No songs found for IDs [${playlistDto.songs.join(', ')}]`)
            }

              playlist.songs = songs
        }else{
            throw new NotFoundException("No songs ID provided")
        }

        const user = await this.userRepo.findOneBy({id:playlistDto.user})
        if (!user) {
            throw new NotFoundException('User not found');
            }
        playlist.user = user;

        return this.playlistRepo.save(playlist)
    }

    async findAll():Promise<Playlist[]>{
        return this.playlistRepo.find()
    }

    async findOne(id:number):Promise<Playlist | null>{
        return this.playlistRepo.findOneBy({id})
    }

    async findUserPlaylist(id:number):Promise<Playlist[]>{
        return this.playlistRepo.findBy({user:{id}})
    }
}
