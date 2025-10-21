import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO, SafeUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcryptjs';

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
}
