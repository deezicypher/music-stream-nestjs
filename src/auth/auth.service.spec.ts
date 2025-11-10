import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import { ArtistsService } from 'src/artists/artists.service';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';


describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: Partial<UsersService>;
  let mockArtistService: Partial<ArtistsService>;
  let mockJWTService: Partial<JwtService>;

  const mockUser: User = {
    id:1,
    first_name: "Deezi",
    last_name: "Codes",
    email: "deezicodes@gmail.com",
    twoFASecret: null,
    enable2FA: false,
    apikey: "e8a76ff2-87c3-4e69-bc7c-6f8cea110119"
  } as any;

  beforeEach(async () => {
    mockUserService = {
      findOne: jest.fn().mockResolvedValue(mockUser),
      findById: jest.fn().mockResolvedValue(mockUser),
      disable2fa: jest.fn().mockResolvedValue({affected:1}),
      findByApiKey: jest.fn().mockResolvedValue(mockUser)
    }
    mockArtistService = {
      findArtist: jest.fn().mockResolvedValue({id:1})
    }
    mockJWTService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token')
    };



    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: UsersService,
          useValue:mockUserService
        },
        {
          provide: ArtistsService,
          useValue: mockArtistService
        },
        {
          provide: JwtService,
          useValue: mockJWTService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access_token if password matches and 2FA disabled', async () => {
       jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true);
      const result = await service.login({email: "deezicodes@gmail.com",password: "123456"})
      expect(result).toEqual({ access_token: 'mock-jwt-token' })
      expect(mockJWTService.sign).toHaveBeenCalled()
    })

    it('should throw unauthorized exception if password do not match', async () => {
      jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(false)
      await expect(service.login({email: "deezicodes@gmail.com",password: "123456"}))
      .rejects.toThrow(UnauthorizedException)
    })
    
    it('should return verify2FA object if 2FA is enabled', async () => {
      jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true)
      mockUser.enable2FA = true
      mockUser.twoFASecret = 'secret'
      const result = await service.login({email:mockUser.email,password:'pass'})
      
      expect(result).toEqual({
        verify2fa: 'http://localhost:3000/auth/validate-2fa',
        message: 'Please send the one-time password/token from your Google Authenticator App'
      })
    })
  })

  describe('enable 2FA', async () => {
      it('should generate and save 2FA secret if not enabled', async() => {
        mockUser.enable2FA =false
        const spyGenerate = jest.spyOn(speakeasy, 'generateSecret').mockReturnValue({ base32: 'mock-secret' } as any);
        const result =  await service.enable2FA(mockUser.id)
        expect(result).toEqual({secret:'mock-secret'})
        expect(mockUserService).toHaveBeenCalledWith(mockUser.id,'mock-secret')
        spyGenerate.mockRestore()

      })

      it('should return existing secret if 2fA is aready enabled', async () => {
        (mockUser as any).enable2FA = true;
      (mockUser as any).twoFASecret = 'existing-secret';
      const result = await service.enable2FA(mockUser.id);
      expect(result).toEqual({ secret: 'existing-secret' });
      })

      it('should throw NotFoundException if user not found', async () => {
      (mockUserService.findById as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.enable2FA(999)).rejects.toThrow(NotFoundException);
    });
  })

});
