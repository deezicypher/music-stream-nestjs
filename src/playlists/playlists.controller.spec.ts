import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { CreatePlayListDto } from './dto/create-playlist-dto';

describe('PlaylistsController', () => {


  let controller: PlaylistsController;
  let mockingPlaylistService:Partial<PlaylistsService>

  beforeEach(async () => {
    mockingPlaylistService = {
      create:jest.fn().mockImplementation((createPlaylistDTO:CreatePlayListDto) => createPlaylistDTO)  
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistsController],
      providers: [
        {
          provide:PlaylistsService,
          useValue:mockingPlaylistService
        }
      ]
    }).compile();

    controller = module.get<PlaylistsController>(PlaylistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a playlist', async () => {
       const playlist = {
        id:1,
        name: "Dancing",
        songs: [1,2],
        user: 1
       }
       const newplaylist = await controller.create(playlist)
       expect(newplaylist).toEqual(playlist)
       expect(mockingPlaylistService.create).toHaveBeenCalledWith(playlist)
  })
});
