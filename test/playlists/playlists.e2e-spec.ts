import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PlaylistsModule } from 'src/playlists/playlists.module';
import { JwtAuthGuard } from 'src/auth/jwt-guard';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Song } from 'src/songs/song.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { User } from 'src/users/user.entity';
import { createUser } from 'test/helpers/create-user.helper';
import { createArtist } from 'test/helpers/create-artist.helper';
import { createSong } from 'test/helpers/create-song.helper';
import { Artist } from 'src/artists/artist.entity';
import { ArtistsModule } from 'src/artists/artists.module';
import { createPlaylist } from 'test/helpers/create-playlist.helper';
import { AuthModule } from 'src/auth/auth.module';


describe('PlaylistController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PlaylistsModule // playist module already imports user,song
        ,ArtistsModule,
        AuthModule,
        ConfigModule.forRoot({
            envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
            isGlobal:true
        }),
        TypeOrmModule.forRootAsync({
            imports:[ConfigModule],
            inject: [ConfigService],
            useFactory: async(configService:ConfigService) => ({
            type: 'postgres',
            url: configService.get<string>('DB_TESTURL'),
            synchronize: true,
            entities: [User,Playlist,Song,Artist],
            dropSchema: true,
            })
        })
      ],  
    })
    .overrideProvider(ConfigService)
    .useValue({
        get: (key: string) => {
            if (key === 'secret') return 'test-secret';
            // fallback to env variable for DB_TESTURL
            return process.env[key] || null;
        },
        })
    .overrideGuard(JwtAuthGuard)
    .useValue({canActivate : context => {
                const req = context.switchToHttp().getRequest();
                req.user = { userId: 2, email: 'mock@user.com' };
            return true;
              }})
    .compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  }); 

  afterEach(async() => {
    const songRepository = app.get(getRepositoryToken(Song));
    const artistRepo = app.get(getRepositoryToken(Artist));
    const userRepo = app.get(getRepositoryToken(User));
    const playlistRepo = app.get(getRepositoryToken(Playlist));
    
    await songRepository.query('DELETE FROM songs_artists');
    await songRepository.query('DELETE FROM "Songs"');
    await playlistRepo.query('DELETE FROM "playlists"');
     await artistRepo.query('DELETE FROM artists');
    await userRepo.query('DELETE FROM "users"'); 
  })
 
  it('/Posts playlists', async () => {
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
    const newSong = await createSong({
        title:"flying",
    artists: [artist.id],
    release_date: new Date("2025-10-12"),
    duration: durationDate,
    lyrics: "Flying .... "
    }, app)

        const user2 = await createUser(
            {
            first_name: "mockuser",
            last_name: "test",
            email: "mockuser@gmail.com",
            password: "123456"
            }, app
            )

    const result = await request(app.getHttpServer())
      .post('/playlists')
      .send({
          name: "life is good",
          songs:[newSong.id],
            user: user2.id
      })
      .expect(201)
      
      expect(result.body.name).toBe("life is good")
  });

  it('fails to create playlist, if song is not found', async () => {
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
    const newSong = await createSong({
        title:"flying",
    artists: [artist.id],
    release_date: new Date("2025-10-12"),
    duration: durationDate,
    lyrics: "Flying .... "
    }, app)

        const user2 = await createUser(
            {
            first_name: "mockuser",
            last_name: "test",
            email: "mockuser@gmail.com",
            password: "123456"
            }, app
            )

    const result = await request(app.getHttpServer())
      .post('/playlists')
      .send({
          name: "life is good",
          songs:[999],
            user: user2.id
      })
      .expect(404)
 
  })
  it('finds all playlist', async () => {
    const user = await createUser(
    {
      first_name: "Deezi",
      last_name: "Codes",
      email: "deezicodes@gmail.com",
      password: "123456"
    },
    app
  );

  const artist = await createArtist(user.id, app);

 
  const durationDate = new Date(0);
  durationDate.setSeconds(120);
  const newSong = await createSong(
    {
      title: "flying",
      artists: [artist.id],
      release_date: new Date("2025-10-12"),
      duration: durationDate,
      lyrics: "Flying .... "
    },
    app
  );

 
  const user2 = await createUser(
    {
      first_name: "mockuser",
      last_name: "test",
      email: "mockuser@gmail.com",
      password: "123456"
    },
    app
  );


  await createPlaylist(
    {
      name: "life is good",
      songs: [newSong.id],
      user: user2.id
    },
    app
  );

  
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: user2.email, password: "123456" })
    .expect(201);

  const accessToken = loginResponse.body.access_token;
  expect(accessToken).toBeDefined();

  
  const results = await request(app.getHttpServer())
    .get(`/playlists`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

 
  expect(results.body).toHaveLength(1);
  expect(results.body[0].name).toBe("life is good"); 
  })

  it('finds one playlist', async () => {
    const user = await createUser(
    {
      first_name: "Deezi",
      last_name: "Codes",
      email: "deezicodes@gmail.com",
      password: "123456"
    },
    app
  );

  const artist = await createArtist(user.id, app);

 
  const durationDate = new Date(0);
  durationDate.setSeconds(120);
  const newSong = await createSong(
    {
      title: "flying",
      artists: [artist.id],
      release_date: new Date("2025-10-12"),
      duration: durationDate,
      lyrics: "Flying .... "
    },
    app
  );

 
  const user2 = await createUser(
    {
      first_name: "mockuser",
      last_name: "test",
      email: "mockuser@gmail.com",
      password: "123456"
    },
    app
  );


  const playlist = await createPlaylist(
    {
      name: "life is good",
      songs: [newSong.id],
      user: user2.id
    },
    app
  );

  
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: user2.email, password: "123456" })
    .expect(201);

  const accessToken = loginResponse.body.access_token;
  expect(accessToken).toBeDefined();

  
  const results = await request(app.getHttpServer())
    .get(`/playlists/${playlist.id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .expect(200);

 
  expect(results.body).toBeDefined();
  expect(results.body.name).toBe("life is good"); 
  })

it('find user playlists', async () => {
 
  const user = await createUser(
    {
      first_name: "Deezi",
      last_name: "Codes",
      email: "deezicodes@gmail.com",
      password: "123456"
    },
    app
  );

  const artist = await createArtist(user.id, app);

 
  const durationDate = new Date(0);
  durationDate.setSeconds(120);
  const newSong = await createSong(
    {
      title: "flying",
      artists: [artist.id],
      release_date: new Date("2025-10-12"),
      duration: durationDate,
      lyrics: "Flying .... "
    },
    app
  );

 
  const user2 = await createUser(
    {
      first_name: "mockuser",
      last_name: "test",
      email: "mockuser@gmail.com",
      password: "123456"
    },
    app
  );


  await createPlaylist(
    {
      name: "life is good",
      songs: [newSong.id],
      user: user2.id
    },
    app
  );

  
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: user2.email, password: "123456" })
    .expect(201);

  const accessToken = loginResponse.body.access_token;
  expect(accessToken).toBeDefined();

  
  const results = await request(app.getHttpServer())
    .get(`/playlists/user/${user2.id}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Accept', 'application/json')
    .expect(200);

 
  expect(results.body).toHaveLength(1);
  expect(results.body[0].name).toBe("life is good"); 
});

});
 