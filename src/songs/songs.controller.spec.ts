import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Song } from './song.entity';

describe('SongsController', () => {
  let controller: SongsController;

  let mockSongsService: Partial<SongsService>;

  beforeEach(async () => {
    mockSongsService = {
      paginate: jest.fn().mockResolvedValue({
        items: [{ id: '1', title: 'Dancing' }],
        meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
      } as unknown as Pagination<Song>),
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
});
