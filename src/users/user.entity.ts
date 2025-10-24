import { Exclude } from "class-transformer";
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

    @Column({unique:true})
    email: string;

    @Column()
    @Exclude()
    password: string;

    @OneToMany(() => Playlist, (playlist) => playlist.user )
    playlists: Playlist[];

    @Column({nullable:true,type:'text'})
    twoFASecret: string | null;

    @Column({default:false,type:'boolean'})
    enable2FA: boolean;

    @Column()
    apikey: string;

}