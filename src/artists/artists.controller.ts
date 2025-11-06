import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDTO } from './dto/create-artist-dto';
import { Artist } from './artist.entity';

@Controller('artists')
export class ArtistsController {
    constructor(
        private artistService:ArtistsService
    ){}

    @Post()
    create(
        @Body()
        createArtistDTO:CreateArtistDTO
    ):Promise<Artist>{
        return this.artistService.create(createArtistDTO)
    }

    @Get(':id')
    findOne(
        @Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE}))
        id:number
    ):Promise<Artist|null>{
        return this.artistService.findArtist(id)
    }
}
