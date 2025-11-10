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
import { JwtModule } from "@nestjs/jwt";
import { JwtArtistGuard } from "src/auth/jwt-artist.guard";
import { JwtAuthGaurd } from "src/auth/jwt-guard";


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
        JwtModule.register({
        secret: 'test-secret',
        signOptions: { expiresIn: '1d' }
      }),
          AuthModule,
            UsersModule
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
          .overrideGuard(JwtAuthGaurd)
          .useValue({canActivate : context => {
            const req = context.switchToHttp().getRequest();
            req.user = { userId: 1, email: 'mock@user.com' };
        return true;
          }})
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

     it('/logins the user', async () => {
          const user = await createUser(
            {
            first_name: "Deezi",
            last_name: "Codes",
            email: "deezicodes@gmail.com",
            password: "123456"
            }, app
            )
          const loginDTO = {email:user.email, password:"123456"}
          const result = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDTO)
        
          expect(result.status).toBe(201)
          expect(result.body.access_token).toBeDefined()
     })

     it('enables 2fa', async () => {
            const user = await createUser(
            {
            first_name: "Deezi",
            last_name: "Codes",
            email: "deezicodes@gmail.com",
            password: "123456"
            }, app
            )
            const loginDTO = {email:user.email, password:"123456"}
           const userLogin = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDTO)
            const result = await request(app.getHttpServer())
            .post('/auth/enable-2fa')
            .set('Authorization', `Bearer ${userLogin.body.access_token}`)
            
          
            expect(result.status).toBe(201)
            expect(result.body.secret).toBeDefined()
     })
     it('returns a verify2fa url', async () => {
                  const user = await createUser(
            {
            first_name: "Deezi",
            last_name: "Codes",
            email: "deezicodes@gmail.com",
            password: "123456"
            }, app
            )
            const loginDTO = {email:user.email, password:"123456"}
           const userLogin = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDTO)
          await request(app.getHttpServer())
          .post('/auth/enable-2fa')
          .set('Authorization', `Bearer ${userLogin.body.access_token}`)

          const result = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDTO)
          expect(result.body.verify2fa).toBe('http://localhost:3000/auth/validate-2fa')
          
            
     })

     it('disable 2fa', async () => {
             const user = await createUser(
            {
            first_name: "Deezi",
            last_name: "Codes",
            email: "deezicodes@gmail.com",
            password: "123456"
            }, app
            )
          const loginDTO = {email:user.email, password:"123456"}
          const userLogin = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDTO)
           await request(app.getHttpServer())
          .post('/auth/enable-2fa')
          .set('Authorization', `Bearer ${userLogin.body.access_token}`)
            
          const result = await request(app.getHttpServer())
          .get('/auth/disable-2fa')
          .set('Authorization', `Bearer ${userLogin.body.access_token}`)

          expect(result.status).toBe(200)
          expect(result.body.affected).toBe(1)
       
     })
})