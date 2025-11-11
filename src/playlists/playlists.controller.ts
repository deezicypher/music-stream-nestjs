import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
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

    @Get()
    @UseGuards(JwtAuthGaurd)
    findAll():Promise<Playlist[]>{
        return this.playlistService.findAll()
    }

    @Get(':id')
    @UseGuards(JwtAuthGaurd)
    findOne(
        @Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE}))
        id:number
    ):Promise<Playlist|null>{
        return this.playlistService.findOne(id)
    }

    @Get()
    @UseGuards(JwtAuthGaurd)
    findUserPlaylist(
        @Request()
        req
    ):Promise<Playlist[]>{
        return this.playlistService.findUserPlaylist(req.user.id)
    }

}
