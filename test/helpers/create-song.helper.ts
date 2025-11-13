import { INestApplication, NotFoundException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Artist } from "src/artists/artist.entity";
import { CreateSongDTO } from "src/songs/dto/create-song-dto";
import { Song } from "src/songs/song.entity";
import { In, Repository } from "typeorm";

export const createSong = async (songDTO:CreateSongDTO,app:INestApplication) => {
        const artistRepo = app.get<Repository<Artist>>(getRepositoryToken(Artist));
        const songRepo = app.get<Repository<Song>>(getRepositoryToken(Song));

        const song = new Song()
        song.title = songDTO.title;
        song.duration = songDTO.duration;
        song.lyrics = songDTO.lyrics;
        song.release_date = songDTO.release_date;
      
        if (songDTO.artists?.length) {
            const artists = await artistRepo.findBy({ id: In(songDTO.artists) });

   
            if (!artists || artists.length === 0) {
            throw new NotFoundException(
                `No artists found for IDs: [${songDTO.artists.join(', ')}]`,
            );
            }

            song.artists = artists;
        } else {
            throw new NotFoundException('No artist IDs provided for this song');
        }

        return  await songRepo.save(song);
    }