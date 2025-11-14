import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

describe('ArtistsController', () => {
  let controller: ArtistsController;
  let mockArtistService: Partial<ArtistsService>;

   
  const artist = {
    user:1,
    songs:[1]
  }

  beforeEach(async () => {
    mockArtistService = {
      create:jest.fn().mockImplementation((artistDTO) => artistDTO),
      findArtist: jest.fn().mockResolvedValue(artist)
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers:[
        {
          provide:ArtistsService,
          useValue: mockArtistService
        }
      ]
    }).compile();

    controller = module.get<ArtistsController>(ArtistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an artist', async () => {
    const result = controller.create(artist)
    expect(mockArtistService.create).toHaveBeenCalledWith(artist)
    expect(result).toEqual(result)
  })
});
