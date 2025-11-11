import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { CreatePlayListDto } from './dto/create-playlist-dto';

describe('PlaylistsController', () => {


  let controller: PlaylistsController;
  let mockingPlaylistService:Partial<PlaylistsService>

  const mockPlaylist = {
    id:1,
    name: "life is good",
    songs:[2],
    user: 1
  }
    const mockPlaylistArray = [{
    id:1,
    name: "life is good",
    songs:[2],
    user: 1
  }]

  beforeEach(async () => {
    mockingPlaylistService = {
      create:jest.fn().mockImplementation((createPlaylistDTO:CreatePlayListDto) => createPlaylistDTO),
      findOne:jest.fn().mockResolvedValue(mockPlaylist),
      findAll:jest.fn().mockResolvedValue(mockPlaylistArray),
      findUserPlaylist:jest.fn().mockResolvedValue(mockPlaylistArray)
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

  it('returns all playlists', async () => {
    const result = await controller.findAll()
    expect(result).toEqual(mockPlaylistArray)
    expect(mockingPlaylistService.findAll).toHaveBeenCalled()
  })

  it('returns a playlist', async () => {
    const result = await controller.findOne(1)
    expect(result).toEqual(mockPlaylist)
    expect(mockingPlaylistService.findOne).toHaveBeenCalledWith(1)
  })

  it('it calls user playlist method', async () => {
    const result = await controller.findUserPlaylist({user:{id:1}})
    expect(result).toEqual(mockPlaylistArray)
  })
});
