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

import { In } from 'typeorm';
import { Playlist } from 'src/playlists/playlist.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createUser } from 'test/helpers/create-user.helper';
import { createArtist } from 'test/helpers/create-artist.helper';
import { createSong } from 'test/helpers/create-song.helper';
import { UpdateSongDTO } from 'src/songs/dto/update-song-dto';
import { JwtArtistGuard } from 'src/auth/jwt-artist.guard';
import { MockAuthGuard } from 'test/helpers/mock-auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';




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
        JwtModule.register({
      secret: process.env.SECRET || 'test_secret',
      signOptions: { expiresIn: '1h' },
    }),
        SongsModule
      ],
    })
    .overrideGuard(JwtArtistGuard)
    .useValue({canActivate : () => true})
    //.useClass(MockAuthGuard)
    .compile();


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





    it('/Get songs', async () => {
        const user = await createUser(
            {
            first_name: "Deezi",
            last_name: "Codes",
            email: "deezicodes@gmail.com",
            password: "123456"
            }, app
            )
        const artist =  await createArtist(user.id,app)

        const durationDate = new Date(0);
        durationDate.setSeconds(120);
        const newSOng = await createSong({
            title:"flying",
        artists: [artist.id],
        release_date: new Date("2025-10-12"),
        duration: durationDate,
        lyrics: "Flying .... "
        }, app)
        const results = await request(app.getHttpServer()).get('/songs')
        expect(results.statusCode).toBe(200)
        expect(results.body.items).toHaveLength(1)
        expect(results.body.items[0].title).toEqual(newSOng.title)
    })

    it('/Puts song/:id', async () => {
        const user = await createUser(
            {
            first_name: "Deezi",
            last_name: "Codes",
            email: "deezicodes@gmail.com",
            password: "123456"
            },app
            )
        const artist =  await createArtist(user.id,app)

        const durationDate = new Date(0);
        durationDate.setSeconds(120);
        const newSOng = await createSong({
            title:"flying",
        artists: [artist.id],
        release_date: new Date("2025-10-12"),
        duration: durationDate,
        lyrics: "Flying .... "
        }, app)

        const updateSongDTO = {title:"Not Flying"}
        const results = await request(app.getHttpServer())
        .put(`/songs/${newSOng.id}`)
        .send(updateSongDTO as UpdateSongDTO)
        expect(results.statusCode).toBe(200)
        expect(results.body.affected).toEqual(1)
    })

    it('/Post songs', async () => {
        const user = await createUser(
            {
            first_name: "Deezi",
            last_name: "Codes",
            email: "deezicodes@gmail.com",
            password: "123456"
            },app
            )
        const artist =  await createArtist(user.id,app)

        const createSongDTO = {
            title:"flying",
        artists: [artist.id],
        release_date: new Date("2025-10-12"),
        duration: "00:02:00",
        lyrics: "Flying .... "
        }
        
  
        const results = await request(app.getHttpServer())
        .post('/songs')
        .send(createSongDTO)

        expect(results.status).toBe(201)
        expect(results.body.title).toBe('flying');

    })

    it('/Delete song', async () => {
        const user = await createUser(
            {
            first_name: "Deezi",
            last_name: "Codes",
            email: "deezicodes@gmail.com",
            password: "123456"
            },app
            )
        const artist =  await createArtist(user.id,app)

       const durationDate = new Date(0);
        durationDate.setSeconds(120);
        const newSong = await createSong({
            title:"flying",
        artists: [artist.id],
        release_date: new Date("2025-10-12"),
        duration: durationDate,
        lyrics: "Flying .... "
        }, app)

        const result = await request(app.getHttpServer())
        .delete(`/songs/${newSong.id}`)
        expect(result.status).toBe(200)
        expect(result.body.affected).toBe(1)
    })
});
