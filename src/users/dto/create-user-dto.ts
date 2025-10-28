import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO{
    @ApiProperty({
      example:"John",
      description:"Provide first name of the user"
    })
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @ApiProperty({
      example:"Doe",
      description:"Provide the last name of the user"
    })
    @IsString()
    @IsNotEmpty()
    last_name: string;


    @ApiProperty({
      example:"johndoe@gmail.com",
      description: "Provide the email of user"
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
      example:"12345",
      description:"Provide the password of the user"
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}


export class SafeUserDTO {
  id: number;
  first_name: string;
  last_name: string;
  email: string;

}