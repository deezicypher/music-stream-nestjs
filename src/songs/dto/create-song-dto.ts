import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSongDTO{
    @IsString()
    @IsNotEmpty()
    readonly title:string;

   
    @IsNotEmpty()
    @IsArray()
    //@IsString({each:true})
    @IsNumber({}, {each:true})
    readonly artists;

    @IsNotEmpty()
    @IsString()
    readonly filePath:string;

    @IsNotEmpty()
    @IsDateString()
    readonly release_date: Date;

    @IsMilitaryTime()
    @IsNotEmpty()
    readonly duration: Date;

    @IsString()
    @IsOptional()
    readonly lyrics: string;
}
