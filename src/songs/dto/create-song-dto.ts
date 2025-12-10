import { Transform } from "class-transformer";
import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSongDTO{
    @IsString()
    @IsNotEmpty()
    readonly title:string;

   
    @IsNotEmpty()
    @IsArray()
    //@IsString({each:true})
    @IsNumber({}, {each:true})
    @Transform(({value})=> {
        if(typeof value === 'string'){
            try {
                 const parsed =  JSON.parse(value)

                 // Ensure it's an array and convert to number
                 return Array.isArray(parsed)? parsed.map(v => Number(v)): [Number(parsed)]
            } catch  {
                return [Number(value)]
            }
        }
        // If already an array, ensure numbers
        if (Array.isArray(value)) {
            return value.map(v => Number(v));
        }
        return [Number(value)];
      
    })
//      when sending multiple fields with the same name in Postman formdata
//     @Transform(({ value }) => {
//     // Handle both array and single value
//     const arr = Array.isArray(value) ? value : [value];
//     return arr.map(v => parseInt(v, 10));  // Convert strings to numbers
// })
    readonly artists;

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
