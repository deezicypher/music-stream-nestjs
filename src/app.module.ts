import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { DevConfigService } from './common/providers/DevConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Song } from './songs/song.entity';
import { Artist } from './artists/artist.entity';
import { User } from './users/user.entity';
import { Playlist } from './playlists/playlist.entity';
import { PlaylistsModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { dataSourceOptions } from 'db/data-source';
import { SeedModule } from './seed/seed.module';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    SongsModule,
    PlaylistsModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
    SeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  constructor(private datasource:DataSource){
    console.log('DB name', this.datasource.driver.database)
  }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); // option no 1
    // consumer.apply(LoggerMiddleware).forRoutes({path:'songs', method:RequestMethod.POST}) //option no 2
  
    consumer.apply(LoggerMiddleware).forRoutes(SongsController)
  }


}
