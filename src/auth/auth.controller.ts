import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user-dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-dto';
import { Enable2FAType } from './types/auth-types';
import { JwtAuthGaurd } from './jwt-guard';

@Controller('auth')
export class AuthController {
    constructor(private userService:UsersService,
        private authService: AuthService
    ){
    }
    
    @Post('signup')
    signup(
        @Body()
        userDto:CreateUserDTO):Promise<Partial<User>>{
        return this.userService.create(userDto)
    }

    @Post('login')
    login(
        @Body()
        loginDTO:LoginDTO
    ){
        return this.authService.login(loginDTO)
    }

    @Post('enable-2fa')
    @UseGuards(JwtAuthGaurd)
    enable2fa(
        @Request()
        req
    ):Promise<Enable2FAType>{
        return this.authService.enable2FA(req.user.userId)
    }

}
