import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Song } from './song.entity';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';

describe('SongsController', () => {
  let controller: SongsController;

  let mockSongsService: Partial<SongsService>;

  beforeEach(async () => {
    mockSongsService = {
      paginate: jest.fn().mockResolvedValue({
        items: [{ id: '1', title: 'Dancing' }],
        meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
      } as unknown as Pagination<Song>),

      findOne: jest.fn().mockImplementation((id:number) => {
        return Promise.resolve({id,title:"Dancing"})
      }),
      
      create: jest.fn().mockImplementation((createSongDTO:CreateSongDTO) => {
        return Promise.resolve({id:1,...createSongDTO})
      }),

      update: jest.fn().mockImplementation((id:number,updateSongDTO:Partial<UpdateSongDTO>) => {
        return Promise.resolve({affected:1})
      }),

      delete: jest.fn().mockImplementation((id:number) => {
        return Promise.resolve({affected:1})
      })
    };
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers:[
        {
          provide:SongsService,
          useValue: mockSongsService
        }
      ]
    }).compile();

    controller = await module.resolve<SongsController>(SongsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get songs', () => {
    it('it should fetch all the songs', async () => {
      const result = await controller.findall(1,10);
      expect(result.items).toEqual([{ id: '1', title: 'Dancing' }]);
      expect(result.meta.totalItems).toBe(1);
    })
  })

  describe('Get song', () => {
    it('should get the song by id', async () => {
      const song = await controller.findOne(1)
      expect(song?.id).toBe(1)
    })
  })

  describe('create song', () => {
    it('should create a new song', async () => {
      const durationDate = new Date(0);
      durationDate.setSeconds(120);

      const newSongDTO:CreateSongDTO = {
        title:"flying",
        artists: "Peder Helland",
        release_date: new Date("2025-10-12"),
        duration: durationDate,
        lyrics: "Flying .... "
      }
      const song = await controller.create(newSongDTO)
      expect(song).toEqual({id:1,...newSongDTO})
      expect(mockSongsService.create).toHaveBeenCalledWith(newSongDTO)
    })
  })

  describe('update song', () => {
    it('should update the song', async () => {
      const updateSongDTO:Partial<UpdateSongDTO> = {
        title: "Not Flying"
      }
      const updatedResult = await controller.update(1,updateSongDTO as UpdateSongDTO)
      expect(updatedResult).toBeDefined()
      expect(updatedResult.affected).toBe(1)
    })
  })

  describe('delete song', () => {
    it('should delete the song', async () => {
      const deleteResult = await controller.delete(1)
      expect(deleteResult).toBeDefined()
      expect(deleteResult.affected).toBe(1)
    })
  })
});
