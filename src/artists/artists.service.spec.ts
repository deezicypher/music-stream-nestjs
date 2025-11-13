import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsService } from './artists.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';

describe('ArtistsService', () => {
  let service: ArtistsService;
  let artistRepo: Repository<Artist>;
  let songRepo: Repository<Song>;
  let userRepo: Repository<User>;
 
  const artist = {
    user:1,
    songs:[1]
  }

   
         const oneSong = {
     title:"flying",
        artists: [1],
        release_date: new Date("2025-10-12"),
        duration: '02:10',
        lyrics: "Flying .... "
  }

         const oneUser = {
    id:1,
    first_name: "Deezi",
    last_name: "Codes",
    email: "deezicodes@gmail.com",
    twoFASecret: null,
    enable2FA: false,
    apikey: "e8a76ff2-87c3-4e69-bc7c-6f8cea110119"
  }
      const mockArtistRepo= {
      findOneBy:jest.fn().mockResolvedValue(artist),
    
      save: jest.fn().mockResolvedValue(artist),
    }
    const mockSongRepo = {
        findBy:jest.fn().mockResolvedValue(oneSong),
    }
     
    const mockUserRepo = {
      findOneBy:jest.fn().mockResolvedValue(oneUser),
    }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistsService,
        {
          provide: getRepositoryToken(Artist),
          useValue: mockArtistRepo
        },
        {
          provide: getRepositoryToken(Song),
          useValue:mockSongRepo
        },
        {
          provide: getRepositoryToken(User),
          useValue:mockUserRepo
        }
      ],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
    artistRepo = module.get<Repository<Artist>>(getRepositoryToken(Artist));
    songRepo = module.get<Repository<Song>>(getRepositoryToken(Song));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates an artist', async () => {
    const result = await service.create(artist)
    expect(userRepo.findOneBy).toHaveBeenCalledWith({id:artist.user})
    expect(songRepo.findBy).toHaveBeenCalledWith({id: In(artist.songs)})
    expect(artistRepo.save).toHaveBeenCalled()
    expect(result).toEqual(artist)
  })
  it('should throw NotfoundExpection if user is not found', async () => {
    (userRepo.findOneBy as jest.Mock).mockResolvedValueOnce(null)
    await expect(service.create(artist)).rejects.toThrow('User not found')

  })
  it('finds artist', async () => {
    const result = await service.findArtist(1)
    expect(artistRepo.findOneBy).toHaveBeenCalledWith({user:{id:1}})
    expect(result).toEqual(artist)
  })
});
