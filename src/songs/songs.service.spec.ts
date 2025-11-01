import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { createQueryBuilder, FindOneOptions, Repository } from 'typeorm';
import { Song } from './song.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';
import { Artist } from 'src/artists/artist.entity';

describe('SongsService', () => {
  let service: SongsService;
  let songRepo: Repository<Song>;
  let artistRepo: Repository<Artist>;

  const durationDate = new Date(0);
  durationDate.setSeconds(120);

  const oneSong = {
     title:"flying",
        artists: [1],
        release_date: new Date("2025-10-12"),
        duration: durationDate,
        lyrics: "Flying .... "
  }

  const songArray = [
    {
       title:"flying",
        artists: [1],
        release_date: new Date("2025-10-12"),
        duration: durationDate,
        lyrics: "Flying .... "
    }
  ]


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide:getRepositoryToken(Song),
          useValue: {
            find: jest.fn().mockResolvedValue(songArray),
            findOneBy: jest
            .fn()
            .mockResolvedValue(oneSong),
            create: jest
            .fn()
            .mockImplementation((dto:CreateSongDTO) => 
               (dto)
            ),
            save: jest.fn().mockResolvedValue(oneSong),
            update: jest
              .fn()
              .mockResolvedValue({affected:1}),
            delete: jest
              .fn()
              .mockResolvedValue({affected: 1 }),
            createQueryBuilder: jest.fn()
            .mockReturnValue({
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue(songArray)
            })
          }
        },
        {
          provide: getRepositoryToken(Artist),
          useValue: {
            findBy: jest.fn().mockResolvedValue([{ id: 1}]),
          },
        },
      ],
    }).compile();

    service = await module.resolve<SongsService>(SongsService);
    songRepo = await module.resolve<Repository<Song>>(getRepositoryToken(Song));
    artistRepo = await module.resolve<Repository<Artist>>(getRepositoryToken(Artist));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should give me the song by id', async () => {
    const song = await service.findOne(1)
    const repoSpy = jest.spyOn(songRepo,"findOneBy")
    expect(song).toEqual(oneSong)
    expect(repoSpy).toHaveBeenCalledWith({id:1})
  })

  it('should create the song', async () => {
    const saveSpy = jest.spyOn(songRepo,'save')
    const artistSpy = jest.spyOn(artistRepo, 'findBy')
    const song = await service.create(oneSong)
    expect(saveSpy).toHaveBeenCalledTimes(1)
    expect(artistSpy).toHaveBeenCalledTimes(1)
    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({
    title: 'flying',
    lyrics: 'Flying .... ',
  }));

  expect(song).toEqual(oneSong);
  })
});
