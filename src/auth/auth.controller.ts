import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user-dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-dto';
import { Enable2FAType } from './types/auth-types';
import { JwtAuthGaurd } from './jwt-guard';
import { Verify2faDTO } from './dto/verify2fa.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private userService:UsersService,
        private authService: AuthService
    ){
    }
    
    @Post('signup')
    @ApiOperation({summary:"Register new user"})
    @ApiResponse({
        status:201,
        description:"It will return the user in the respose"
    })
    signup(
        @Body()
        userDto:CreateUserDTO):Promise<Partial<User>>{
        return this.userService.create(userDto)
    }


    @Post('login')
    @ApiOperation({summary: "Login user"})
    @ApiResponse({
        status:200,
        description: "it will give you the access token in the response"
    })
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

    @Post('verify-2fa')
    @UseGuards(JwtAuthGaurd)
    verify2fa(
        @Request()
        req,
        @Body()
        verify2faDTO:Verify2faDTO
    ):Promise<{verified:boolean}>{
        return this.authService.verify2fa(req.user.userId,verify2faDTO.token)
    }

    @Get('disable-2fa')
    @UseGuards(JwtAuthGaurd)
    disable2fa(
        @Request()
        req
    ):Promise<UpdateResult>{
        return this.authService.disable2fa(req.user.userId)
    }

      @Get('profile')
        @UseGuards(AuthGuard('bearer'))
        getProfile(
            @Request()
            req
        ){
            delete req.user.password

            return {
            msg: "Authenticated",
            user: req.user
        }
    }

    @Get('test')
    getEnv(){
        return this.authService.getEnv()
    }

}
