import { IsNotEmpty, IsString } from "class-validator";

export class Verify2faDTO{
    @IsString()
    @IsNotEmpty()
    token:string
}