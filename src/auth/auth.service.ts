import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-dto';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './types/payload.type';


@Injectable()
export class AuthService {
  constructor(private userService:UsersService,
    private jwtService:JwtService,
    private artistSevice:ArtistsService
  ){}
  async login(loginDTO:LoginDTO):Promise<{access_token:string}>{
    const user = await this.userService.findOne(loginDTO)
    const passwordMarched = await bcrypt.compare(loginDTO.password,user.password)

    if(passwordMarched){
     
        const payload: PayloadType = {email:user.email,userId:user.id}
        const artist = await this.artistSevice.findArtist(user.id)
        if(artist){
          payload.artistId= artist.id
        }
        return {access_token:this.jwtService.sign(payload)}
    }else{
        throw new UnauthorizedException('Password does not match')
    }
    
  }
}
