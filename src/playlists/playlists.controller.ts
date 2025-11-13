import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Query, Request, UseGuards } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlayListDto } from './dto/create-playlist-dto';
import { Playlist } from './playlist.entity';
import { JwtAuthGuard } from 'src/auth/jwt-guard';
import { MatchUserIdGuard } from 'src/auth/match-userid.guard';

@Controller('playlists')
export class PlaylistsController {
    constructor(
        private playlistService:PlaylistsService
    ){};

    @Post()
    @UseGuards(JwtAuthGuard)
    create ( 
        @Body()
        playlistDto:CreatePlayListDto):Promise<Playlist>{
            return this.playlistService.create(playlistDto)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll():Promise<Playlist[]>{
        return this.playlistService.findAll()
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(
        @Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE}))
        id:number
    ):Promise<Playlist|null>{
        return this.playlistService.findOne(id)
    }

    @Get('user/:id')
    @UseGuards(JwtAuthGuard)
    findUserPlaylist(
        @Param('id',new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE}))
        id:number
    ):Promise<Playlist[]>{
        return this.playlistService.findUserPlaylist(id)
    }

}
