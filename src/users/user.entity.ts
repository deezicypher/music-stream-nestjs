import { Playlist } from "src/playlists/playlist.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name:string;

    @Column()
    last_name:string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Playlist, (playlist) => playlist.user )
    playlists: Playlist[]

}