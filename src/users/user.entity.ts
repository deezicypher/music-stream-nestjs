import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Playlist } from "src/playlists/playlist.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example:"John",
        description:"Provide the first name of the user"
    })
    @Column()
    first_name:string;


    @ApiProperty({
        example:"Doe",
        description:"Provide the last name of the user"
    })
    @Column()
    last_name:string;

    @ApiProperty({
        example:"johndoe@gmail.com",
        description:"Provide the email of the user"
    })
    @Column({unique:true})
    email: string;

    @ApiProperty({
        example:"12345",
        description:"Provide the password of the user"
    })
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