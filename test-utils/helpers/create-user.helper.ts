import { INestApplication } from "@nestjs/common"
import { getRepositoryToken } from "@nestjs/typeorm"
import { CreateUserDTO } from "src/users/dto/create-user-dto"
import { User } from "src/users/user.entity"
import {v4 as uuid4} from 'uuid'
import * as bcrypt from 'bcryptjs';


export const createUser =  async (userDTO:CreateUserDTO,app:INestApplication)=>{
               const user = new User()
               user.first_name = userDTO.first_name
               user.last_name = userDTO.last_name
               user.email = userDTO.email
               user.apikey = uuid4()
       
               const salt = await bcrypt.genSalt();
               user.password = await bcrypt.hash(userDTO.password, salt);
               const userRepo = app.get(getRepositoryToken(User))
               const savedUser = await userRepo.save(user);
               const { password, ...safeUser } = savedUser;
               return safeUser;
    }