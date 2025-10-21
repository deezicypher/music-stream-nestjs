import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO{
    @IsString()
    @IsNotEmpty()
    first_name: string;
    
    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

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