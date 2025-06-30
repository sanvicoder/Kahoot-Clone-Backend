import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nickname: string;
}