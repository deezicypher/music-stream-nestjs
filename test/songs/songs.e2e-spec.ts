import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { SongsModule } from 'src/songs/songs.module';
import { Song } from 'src/songs/song.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { CreateSongDTO } from 'src/songs/dto/create-song-dto';
import { Artist } from 'src/artists/artist.entity';
import { CreateUserDTO } from 'src/users/dto/create-user-dto';
import { User } from 'src/users/user.entity';
import {v4 as uuid4} from 'uuid'
import * as bcrypt from 'bcryptjs';
import { In } from 'typeorm';
import { Playlist } from 'src/playlists/playlist.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';




describe('Songs - /songs', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
              envFilePath:[`${process.cwd()}/.env.${process.env.NODE_ENV}`],
              isGlobal:true,
            }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService:ConfigService) =>  ({
        type: 'postgres',
        url: configService.get<string>('DB_TESTURL'),
        synchronize: true,
        entities: [Song,Artist,User,Playlist],
        dropSchema: true,
    })}),
        TypeOrmModule.forFeature([Song, Artist, User, Playlist]),
        SongsModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

    afterEach(async () => {
    // Fetch all the entities
    const songRepository = app.get(getRepositoryToken(Song));
    const userRepo = app.get(getRepositoryToken(User));
    const artistRepo = app.get(getRepositoryToken(Artist));
    const playlistRepo = app.get(getRepositoryToken(Playlist))
 
    // 1. Clear join tables first
    await songRepository.query('DELETE FROM songs_artists');

    // 2. Delete songs (foreign key to playlist will fail if playlist exists)
    await songRepository.query('DELETE FROM "Songs"');

    // 3. Delete playlists
    await playlistRepo.query('DELETE FROM playlists');

    // 4. Delete artists
    await artistRepo.query('DELETE FROM artists');

    // 5. Delete users
    await userRepo.query('DELETE FROM "users"'); 
    });

    const createUser =  async (userDTO:CreateUserDTO)=>{
               const user = new User()
               user.first_name = userDTO.first_name
               user.last_name = userDTO.last_name
               user.email = userDTO.email
               user.apikey = uuid4()
       
               const salt = await bcrypt.genSalt();
               user.password = await bcrypt.hash(userDTO.password, salt);
               const userRepo = app.get(getRepositoryToken(User))
               const savedUser = await userRepo.save(user);
               const { password, ...safeUser } = savedUser;
               return safeUser;
    }
    const createArtist = async (userId:number) => {
        const artist = new Artist()
         const userRepo = app.get(getRepositoryToken(User))
        const user = await userRepo.findOneBy({id:userId})
        artist.user = user!
         const artistRepo = app.get(getRepositoryToken(Artist))
        return artistRepo.save(artist)
    }
    const createSong = async (songDTO:CreateSongDTO) => {

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

    it('/Get songs', async () => {
        const user = await createUser(
            {
            first_name: "Deezi",
            last_name: "Codes",
            email: "deezicodes@gmail.com",
            password: "123456"
            }
            )
        const artist =  await createArtist(user.id)

        const durationDate = new Date(0);
        durationDate.setSeconds(120);
        const newSOng = await createSong({
            title:"flying",
        artists: [artist.id],
        release_date: new Date("2025-10-12"),
        duration: durationDate,
        lyrics: "Flying .... "
        })
        const results = await request(app.getHttpServer()).get('/songs')
        expect(results.statusCode).toBe(200)
        expect(results.body.items).toHaveLength(1)
        expect(results.body.items[0].title).toEqual(newSOng.title)
    })
});
