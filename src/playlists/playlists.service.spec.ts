import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsService } from './playlists.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { Playlist } from './playlist.entity';
import { In, Repository } from 'typeorm';


describe('PlaylistsService', () => {
  let service: PlaylistsService;
  let playlistRepo: Repository<Playlist>;
  let songRepo: Repository<Song>;
  let userRepo: Repository<User>;

        const playlist = {
        id:1,
        name: "Dancing",
        songs: [1,2],
        user: 1
       }
         const durationDate = new Date(0);
  durationDate.setSeconds(120);
         const oneSong = {
     title:"flying",
        artists: [1],
        release_date: new Date("2025-10-12"),
        duration: durationDate,
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

       const mockSongRepo = {
          findBy: jest.fn().mockResolvedValue([oneSong])
       }
       const mockUserRepo = {
        findOneBy: jest.fn().mockResolvedValue(oneUser)
       }

       const mockPlaylistRepo = {
        save: jest.fn().mockResolvedValue(playlist)
       }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaylistsService,
        {
          provide: getRepositoryToken(Song),
          useValue:mockSongRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue:mockUserRepo
        },
        {
          provide: getRepositoryToken(Playlist),
          useValue:mockPlaylistRepo
        }
      ],
    }).compile();

    service = module.get<PlaylistsService>(PlaylistsService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    songRepo = module.get<Repository<Song>>(getRepositoryToken(Song));
    playlistRepo = module.get<Repository<Playlist>>(getRepositoryToken(Playlist));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a playlist', async () => {
    const result = await service.create(playlist)
    expect(songRepo.findBy).toHaveBeenCalledWith({id: In(playlist.songs)})
    expect(userRepo.findOneBy).toHaveBeenCalledWith({id: playlist.user})
    expect(playlistRepo.save).toHaveBeenCalled()
    expect(result).toEqual(playlist)
  })

  it('should throw NotfoundExpection if user is not found', async () => {
    (userRepo.findOneBy as jest.Mock).mockResolvedValueOnce(null);
    await expect(service.create(playlist)).rejects.toThrow('User not found');
  })
});
