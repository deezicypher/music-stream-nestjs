import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { ArtistsController } from './artists.controller';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Artist,Song,User])],
  providers: [ArtistsService],
  exports:[ArtistsService],
  controllers: [ArtistsController]
})
export class ArtistsModule {}
