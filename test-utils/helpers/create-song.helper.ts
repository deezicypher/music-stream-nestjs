import { INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Artist } from "src/artists/artist.entity";
import { CreateSongDTO } from "src/songs/dto/create-song-dto";
import { Song } from "src/songs/song.entity";
import { In } from "typeorm";

export const createSong = async (songDTO:CreateSongDTO,app:INestApplication) => {

        const song = new Song()
        song.title = songDTO.title;
        song.duration = songDTO.duration;
        song.lyrics = songDTO.lyrics;
        song.release_date = songDTO.release_date;
        const artistRepo = app.get(getRepositoryToken(Artist))
        const artists = await artistRepo.findBy({id: In(songDTO.artists)});
        song.artists = artists;

        const songRepo = app.get(getRepositoryToken(Song));
        return  await songRepo.save(song);
    }