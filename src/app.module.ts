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

const devConfig = {port:3000}
const proConfig = {port:400}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:5432,
      username:process.env.DB_USERNAME,
      password:process.env.db_password,
      database:'spotify_nestjs',
      entities:[Song],
      synchronize:true
    }),
    SongsModule],
  controllers: [AppController],
  providers: [AppService,

    {
      provide: DevConfigService,
      useClass: DevConfigService
    },
    {
      provide: 'CONFIG',
      useFactory: () => {
        return process.env.NODE_ENV === 'dev' ? devConfig : proConfig
      }
    }    
  ],
})
export class AppModule implements NestModule {

  constructor(private datasource:DataSource){
    console.log('DB name', datasource.driver.database)
  }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); // option no 1
    // consumer.apply(LoggerMiddleware).forRoutes({path:'songs', method:RequestMethod.POST}) //option no 2
  
    consumer.apply(LoggerMiddleware).forRoutes(SongsController)
  }


}
