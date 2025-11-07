import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user-dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Repository<User>;
 
  const oneUser = {
    id:1,
    first_name: "Deezi",
    last_name: "Codes",
    email: "deezicodes@gmail.com",
    twoFASecret: null,
    enable2FA: false,
    apikey: "e8a76ff2-87c3-4e69-bc7c-6f8cea110119"
  }

    const mockUserRepo = {
    save: jest.fn().mockResolvedValue(oneUser),
    findOneBy: jest.fn().mockResolvedValue(oneUser),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call repo save when saving a user', async () => {
    const dto = { first_name: 'John', last_name: 'Doe', email: 'test@test.com', password: '123456' };
    const results = await service.create(dto)
    console.log(results)
    expect(userRepo.save).toHaveBeenCalled()
    
  })
});
