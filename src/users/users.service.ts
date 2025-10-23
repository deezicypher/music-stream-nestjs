import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO, SafeUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login-dto';

@Injectable()
export class UsersService {
      constructor(
        @InjectRepository(User)
        private userRepo:Repository<User>
    ){}

    async create(userDTO:CreateUserDTO):Promise<Partial<User>>{
        const salt = await bcrypt.genSalt();
        userDTO.password = await bcrypt.hash(userDTO.password, salt);
        const user = await this.userRepo.save(userDTO);
        const { password, ...safeUser } = user;
        return safeUser;
    }

    async findOne(data:LoginDTO):Promise<User>{
        const user = await this.userRepo.findOneBy({email:data.email})
        if(!user){
            throw new UnauthorizedException('Could not find user')
        }
        return user
    }

    async findById(id:number):Promise<User | null>{
        return this.userRepo.findOneBy({id})
    }

    updateSecretKey(userId,secretKey):Promise<UpdateResult>{
        return this.userRepo.update({id:userId},{
            twoFASecret:secretKey,
            enable2FA:true
        })
    }

    disable2fa(userId:number):Promise<UpdateResult>{
        return this.userRepo.update({id:userId},{
            twoFASecret:null,
            enable2FA:false
        })
    }
}
