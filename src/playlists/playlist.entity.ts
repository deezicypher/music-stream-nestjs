import { Song } from "src/songs/song.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity('playlists')
export class Playlist{
    @PrimaryColumn()
    id:number;

    @Column()
    name:string;

    @OneToMany(() => Song, (song) => song.playlist)
    songs: Song[];

    @ManyToOne(() => User, (user) => user.playlists)
    user: User;

    
}