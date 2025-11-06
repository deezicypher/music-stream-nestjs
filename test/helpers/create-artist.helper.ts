import { INestApplication } from "@nestjs/common"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Artist } from "src/artists/artist.entity"
import { User } from "src/users/user.entity"

export const createArtist = async (userId:number,app:INestApplication) => {
        const artist = new Artist()
         const userRepo = app.get(getRepositoryToken(User))
        const user = await userRepo.findOneBy({id:userId})
        artist.user = user!
         const artistRepo = app.get(getRepositoryToken(Artist))
        return artistRepo.save(artist)
    }