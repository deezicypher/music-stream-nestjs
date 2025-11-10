import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDTO } from 'src/users/dto/create-user-dto';
import { LoginDTO } from './dto/login-dto';
import { JwtAuthGaurd } from './jwt-guard';

describe('AuthController', () => {
  let controller: AuthController;
  let mockingAuthService: Partial<AuthService>
  let mockingUserService: Partial<UsersService>

  mockingUserService = {
    create: jest.fn().mockImplementation((userDto:CreateUserDTO) => userDto),
  }

  mockingAuthService = {
    login: jest.fn().mockResolvedValue({access_token:"mock+token"}),
    enable2FA: jest.fn().mockResolvedValue({secret:"mock_secret"}),
    disable2fa: jest.fn().mockResolvedValue({affected:1})
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
         {
          provide: AuthService,
          useValue:mockingAuthService
         },{
          provide: UsersService,
          useValue:mockingUserService
         }
      ]
    }) .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
       const createUserDTO = {
                    first_name: "Deezi",
                    last_name: "Codes",
                    email: "deezicodes@gmail.com",
                    password: "123456"
                    }
    const result = await controller.signup(createUserDTO)
    expect(result).toEqual(createUserDTO)
    expect(mockingUserService.create).toHaveBeenCalledWith(createUserDTO)
  })

  it('logins the user', async () => {
    const loginDTO = {
                  email: "deezicodes@gmail.com",
            password: "123456"
    }
    const result = await controller.login(loginDTO) as { access_token: string };
    expect(mockingAuthService.login).toHaveBeenCalledWith(loginDTO)
    expect(result.access_token).toBe('mock+token')
  })
  it('enable 2fa', async () => {
    const result = await controller.enable2fa({ user: { userId: 1 } } as any);
    expect(mockingAuthService.enable2FA).toHaveBeenCalledWith(1)
    expect(result.secret).toBe('mock_secret')
  })
});
