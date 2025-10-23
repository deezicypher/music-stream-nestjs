import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-dto';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './types/payload.type';
import { Enable2FAType } from './types/auth-types';
import * as speakeasy from 'speakeasy';


@Injectable()
export class AuthService {
  constructor(private userService:UsersService,
    private jwtService:JwtService,
    private artistSevice:ArtistsService
  ){}
  async login(loginDTO:LoginDTO):Promise<{access_token:string}>{
    const user = await this.userService.findOne(loginDTO)
    const passwordMatched = await bcrypt.compare(loginDTO.password,user.password)

    if(passwordMatched){
     
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

  async enable2FA(userId:number):Promise<Enable2FAType>{
    const user = await this.userService.findById(userId)
    if(!user){
      throw new NotFoundException(`User with ${userId} not found`)
    }
    if(user.enable2FA){
      return {secret: user.twoFASecret}
    }
    const secret = speakeasy.generateSecret()
    user.twoFASecret = secret.base32
    await this.userService.updateSecretKey(user.id, user.twoFASecret)
    return {secret:user.twoFASecret}
  }

  async verify2fa(userId:number,token:string):Promise<{verified:boolean}>{
    const user = await this.userService.findById(userId)
    if(!user){
      throw new NotFoundException(`User with ${userId} not found`)
    }
    try {
      const verified = speakeasy.totp.verify({
        secret:user.twoFASecret,
        token,
        encoding: 'base32'
      })
      if(verified){
        return {verified:true}
      }else{
        return {verified: false}
      }
    } catch (error) {
      throw new UnauthorizedException('Error verifying token')
    }
  }
}
