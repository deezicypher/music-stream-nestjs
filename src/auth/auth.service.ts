import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-dto';
import * as bcrypt from 'bcryptjs'


@Injectable()
export class AuthService {
  constructor(private userService:UsersService){}
  async login(loginDTO:LoginDTO){
    const user = await this.userService.findOne(loginDTO)
    const passwordMarched = await bcrypt.compare(loginDTO.password,user.password)

    if(passwordMarched){
        const {password, ...safeUser} = user
        return safeUser
    }else{
        throw new UnauthorizedException('Password does not match')
    }
    
  }
}
