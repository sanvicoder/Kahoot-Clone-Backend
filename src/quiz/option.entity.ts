import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './question.entity';

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

  @ManyToOne(() => Question, question => question.options, { onDelete: 'CASCADE' })
  question: Question;
}
