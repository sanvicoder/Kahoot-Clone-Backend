import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './question.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column()
  isCorrect: boolean;

  @Column()
  color: string;

  @Exclude()
  @ManyToOne(() => Question, question => question.options, { onDelete: 'CASCADE' })
  question: Question;
}
