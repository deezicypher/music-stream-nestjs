import { INestApplication } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { UsersModule } from "src/users/users.module";
import { createUser } from "test/helpers/create-user.helper";
import request from 'supertest';
import { Playlist } from "src/playlists/playlist.entity";
import { Song } from "src/songs/song.entity";
import { Artist } from "src/artists/artist.entity";
import { AuthModule } from "src/auth/auth.module";


describe('Auth - /auth', () => {
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
            entities: [User,Playlist,Song,Artist],
            dropSchema: true,
        })}),
        
          AuthModule,
            UsersModule
          ],
        })
        .compile();
    
    
        app = moduleFixture.createNestApplication();
        await app.init();
      });
        afterEach(async () => {
          // Fetch all the entities

          const userRepo = app.get(getRepositoryToken(User));
          await userRepo.query('DELETE FROM "users"'); 

          });

      it('/Posts user', async () => {
        const createUserDTO = {
                    first_name: "Deezi",
                    last_name: "Codes",
                    email: "deezicodes@gmail.com",
                    password: "123456"
                    }
        const result = await request(app.getHttpServer())  
        .post('/auth/signup')
        .send(createUserDTO)

        expect(result.status).toBe(201)
        expect(result.body.first_name).toBe(createUserDTO.first_name)
        
     })
})