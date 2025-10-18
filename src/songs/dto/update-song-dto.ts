import { IsArray, IsDateString, IsMilitaryTime, IsOptional, IsString } from "class-validator";

export class UpdateSongDTO{
    @IsString()
    @IsOptional()
    readonly title:string;

   
    @IsOptional()
    @IsArray()
    @IsString({each:true})
    readonly artists: string[];

    @IsOptional()
    @IsDateString()
    readonly release_date: Date;

    @IsMilitaryTime()
    @IsOptional()
    readonly duration: Date;

    @IsString()
    @IsOptional()
    readonly lyrics: string;
}
