import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Option } from './option.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

@Column({ nullable: true, type: 'text' }) // optional: `type: 'text'` for long strings
image: string | null;

  @Column({ default: 30 })
  timeLimit: number;

  @ManyToOne(() => Quiz, quiz => quiz.questions, { onDelete: 'CASCADE' })
  quiz: Quiz;

 @OneToMany(() => Option, option => option.question, { cascade: true, eager: true })
options: Option[];

}
