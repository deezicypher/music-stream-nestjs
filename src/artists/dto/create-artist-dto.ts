import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateArtistDTO {
    @IsNumber()
    @IsNotEmpty()
    readonly user: number;

    @IsNumber({},{each:true})
    @IsArray()
    @IsOptional()
    readonly songs: number[];
}   