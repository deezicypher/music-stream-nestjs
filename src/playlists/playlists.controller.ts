import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlayListDto } from './dto/create-playlist-dto';
import { Playlist } from './playlist.entity';
import { JwtAuthGaurd } from 'src/auth/jwt-guard';

@Controller('playlists')
export class PlaylistsController {
    constructor(
        private playlistService:PlaylistsService
    ){};

    @Post()
    @UseGuards(JwtAuthGaurd)
    create ( 
        @Body()
        playlistDto:CreatePlayListDto):Promise<Playlist>{
            return this.playlistService.create(playlistDto)
    }
}
