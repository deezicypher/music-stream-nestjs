import { INestApplication, NotFoundException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreatePlayListDto } from "src/playlists/dto/create-playlist-dto";
import { Playlist } from "src/playlists/playlist.entity";
import { Song } from "src/songs/song.entity";
import { User } from "src/users/user.entity";
import { In, Repository } from "typeorm";

export const createPlaylist =  async(playlistDTO:CreatePlayListDto, app:INestApplication) => {
    const songRepo = app.get<Repository<Song>>(getRepositoryToken(Song))
    const userRepo = app.get<Repository<User>>(getRepositoryToken(User)) 
    const playlistRepo = app.get<Repository<Playlist>>(getRepositoryToken(Playlist))


    const playlist = new Playlist()
    playlist.name = playlistDTO.name
  
    if(playlistDTO.songs.length) {
        const songs = await songRepo.findBy({id: In(playlistDTO.songs)})
        
        if(!songs || songs.length === 0 ){
            throw new NotFoundException(`No songs found for IDs [${playlistDTO.songs.join(', ')}]`)
        }

            playlist.songs = songs
    }else{
        throw new NotFoundException("No songs ID provided")
    }
    const user = await userRepo.findOneBy({id:playlistDTO.user})
    if(!user){
        throw new NotFoundException('User not found')
    }
    playlist.user = user

    return await playlistRepo.save(playlist)

}