import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO, SafeUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login-dto';
import {v4 as uuid4} from 'uuid'



@Injectable()
export class UsersService {
      constructor(
        @InjectRepository(User)
        private userRepo:Repository<User>
    ){}

    async create(userDTO:CreateUserDTO):Promise<Partial<User>>{
        const user = new User()
        user.first_name = userDTO.first_name
        user.last_name = userDTO.last_name
        user.email = userDTO.email
        user.apikey = uuid4()

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(userDTO.password, salt);
        const savedUser = await this.userRepo.save(user);
        const { password, ...safeUser } = savedUser;
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

    findByApiKey(apikey:string):Promise<User|null>{
        return this.userRepo.findOneBy({apikey})
    }
}
