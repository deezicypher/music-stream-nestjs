import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ArtistsModule } from 'src/artists/artists.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Song } from 'src/songs/song.entity';
import { Artist } from 'src/artists/artist.entity';
import { JwtAuthGuard } from 'src/auth/jwt-guard';
import { createUser } from 'test/helpers/create-user.helper';
import { Playlist } from 'src/playlists/playlist.entity';

describe('ArtisyController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ArtistsModule,Playlist,
        ConfigModule.forRoot({
            envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`]
        }),
        TypeOrmModule.forRootAsync({
            imports:[ConfigModule],
            inject: [ConfigService],
            useFactory: async(configService:ConfigService) => ({
            type: 'postgres',
            url: configService.get<string>('DB_TESTURL'),
            synchronize: true,
            entities: [User,Song,Artist,Playlist],
            dropSchema: true,
        })
    })
      ],
    }).overrideProvider(ConfigService)
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
      

      
      await songRepository.query('DELETE FROM songs_artists');
      await songRepository.query('DELETE FROM "Songs"');
        
       await artistRepo.query('DELETE FROM artists');
      await userRepo.query('DELETE FROM "users"'); 
    })

    it('/Posts artists', async () => {
        const user = await createUser(
                {
                first_name: "Deezi",
                last_name: "Codes",
                email: "deezicodes@gmail.com",
                password: "123456"
                }, app
                )
        const artist = {
            user: user.id,
            songs:[]
        }  

        const result = await request(app.getHttpServer())
        .post('/artists')
        .send(artist)
        .expect(201)

        expect(result.body.user.id).toEqual(artist.user)
            
    })

});
