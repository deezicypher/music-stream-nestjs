import { Artist } from "src/artists/artist.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Songs')
export class Song{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title: string;

    //@Column('varchar', {array:true})
    //artists: string[];
    @ManyToMany(()=>Artist, (artist) => artist.songs, {cascade:true})
    @JoinTable({name:'songs_artists'})
    artists: Artist[]

    @Column('date')
    release_date: Date;

    @Column('time')
    duration: Date;

    @Column('text')
    lyrics: string;


}