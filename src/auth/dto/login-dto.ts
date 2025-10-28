import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDTO {
    @ApiProperty({
        example: "johndoe@gmail.com",
        description: "Provide user email"
    })
    @IsString()
    @IsNotEmpty()
    email:string

    @ApiProperty({
        example:"12345",
        description:"Provide user password"
    })
    @IsString()
    @IsNotEmpty()
    password:string

}