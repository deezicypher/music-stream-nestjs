import { EntityManager } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { User } from "src/users/user.entity";
import {faker} from '@faker-js/faker';
import { v4 as uuid4} from 'uuid';
import { Artist } from "src/artists/artist.entity";
import { Playlist } from "src/playlists/playlist.entity";

export const seedData = async (manager:EntityManager):Promise<void> => {
    await seedUser()
    await seedArtist()
    await seedPlayList()


    async function seedUser(){
        const salt = await bcrypt.genSalt();
        const encryptedPass = await bcrypt.hash('12345', salt);
        const user = new User();
        user.first_name = faker.person.firstName();
        user.last_name = faker.person.lastName();
        user.email = faker.internet.email();
        user.password = encryptedPass;
        user.apikey = uuid4()

        await manager.getRepository(User).save(user)
    }

    async function seedArtist(){
        const salt = await bcrypt.genSalt();
        const encryptedPass = await bcrypt.hash('12345', salt);
        const user = new User();
        user.first_name = faker.person.firstName();
        user.last_name = faker.person.lastName();
        user.email = faker.internet.email();
        user.password = encryptedPass;
        user.apikey = uuid4()

        const artist = new Artist()
        artist.user = user

        await manager.getRepository(User).save(user)
        await manager.getRepository(Artist).save(artist)
    } 

    async function seedPlayList(){
        const salt = await bcrypt.genSalt();
        const encryptedPass = await bcrypt.hash('12345', salt);
        const user = new User();
        user.first_name = faker.person.firstName();
        user.last_name = faker.person.lastName();
        user.email = faker.internet.email();
        user.password = encryptedPass;
        user.apikey = uuid4()

        const playlist = new Playlist()
        playlist.name = faker.music.genre()
        playlist.user = user

        await manager.getRepository(User).save(user)
        await manager.getRepository(Playlist).save(playlist)
    }

}