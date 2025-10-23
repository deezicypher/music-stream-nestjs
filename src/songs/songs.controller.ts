import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Post, Put, Query, Request, Scope, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { type Connection } from 'src/common/constants/connection';
import { Song } from './song.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDTO } from './dto/update-song-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from 'src/auth/jwt-artist.guard';

@Controller({path:'songs', scope:Scope.REQUEST})
export class SongsController {
    constructor(private songsService:SongsService
    ){
        
        }
        ;
    @Post()
    @UseGuards(JwtArtistGuard)
    create(@Body() createSongDTO: CreateSongDTO, @Request() req ): Promise<Song>{
        return this.songsService.create(createSongDTO);
    };

    @Get()
    findall(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe)
        page:number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit:number = 10
    ):Promise<Pagination<Song>>{
      limit = limit > 100? 100 : limit
      return this.songsService.paginate({page,limit})
        
    };

    @Get(':id')
    findOne(
        // @Param('id', ParseIntPipe) // option 1
        @Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE}))
        id:number
    ):Promise<Song | null>{
        return this.songsService.findOne(id);
    };

    @Put(':id')
    update(
        @Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE}))
        id:number,
          @Body()
        updateSongDTO:UpdateSongDTO
    ):Promise<UpdateResult>{
        return this.songsService.update(id,updateSongDTO);
    };

    @Delete(':id')
    delete(
        @Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE}))
        id:number):Promise<DeleteResult>{
        return this.songsService.delete(id);
    };
}
