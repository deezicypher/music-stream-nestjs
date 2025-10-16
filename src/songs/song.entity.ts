import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Songs')
export class Song{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title: string;

    @Column('varchar', {array:true})
    artists: string[];

    @Column('date')
    release_date: Date;

    @Column('time')
    duration: Date;

    @Column('text')
    lyrics: string;


}