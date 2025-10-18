import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Post, Put, Scope } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { type Connection } from 'src/common/constants/connection';
import { Song } from './song.entity';

@Controller({path:'songs', scope:Scope.REQUEST})
export class SongsController {
    constructor(private songsService:SongsService
    ){
        
        }
        ;
    @Post()
    create(@Body() createSongDTO: CreateSongDTO ): Promise<Song>{
        return this.songsService.create(createSongDTO);
    };

    @Get()
    findall():Promise<Song[]>{
        try{
            return this.songsService.findAll();
        }catch(e){
            throw new HttpException(
                'server error bug',
                HttpStatus.INTERNAL_SERVER_ERROR,{
                    cause:e
                }
            )
           
        };
        
    };

    @Get(':id')
    findOne(
        // @Param('id', parseIntPipe) // option 1
        @Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE}))
        id:number
    ):Promise<Song | null>{
        return this.songsService.findOne(id);
    };

    @Put(':id')
    update(){
        return 'Update song based on id';
    };

    @Delete(':id')
    delete(){
        return 'Delete song based on id';
    };
}
