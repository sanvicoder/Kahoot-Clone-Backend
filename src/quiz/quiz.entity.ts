import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Question, question => question.quiz, { cascade: true })
  questions: Question[];
}
