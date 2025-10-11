import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';

@Controller('songs')
export class SongsController {
    constructor(private songsService:SongsService){};
    @Post()
    create(@Body() createSongDTO: CreateSongDTO ){
        return this.songsService.create(createSongDTO);
    };

    @Get()
    findall(){
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
    ){
        return `FInd song based on id ${typeof id}`;
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
