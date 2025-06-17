import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Question } from './question.entity';
import { Option } from './option.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { AddQuestionDto } from './dto/add-question.dto';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Option) private optionRepo: Repository<Option>,
  ) {}

  async createQuiz(data: CreateQuizDto, userId: number) {
    const quiz = this.quizRepo.create({ title: data.title, createdBy: userId });
    await this.quizRepo.save(quiz);

    for (const q of data.questions) {
      const question = this.questionRepo.create({
        text: q.text,
        timeLimit: q.timeLimit,
        image: q.image,
        quiz,
      });
      await this.questionRepo.save(question);

      for (const o of q.options) {
        const option = this.optionRepo.create({
          text: o.text,
          isCorrect: o.isCorrect,
          color: o.color,
          question,
        });
        await this.optionRepo.save(option);
      }
    }

    return quiz;
  }

 async addQuestionToQuiz(quizId: string, data: AddQuestionDto, userId: number) {
  if (!isUUID(quizId)) {
    throw new BadRequestException('Invalid quiz ID format');
  }

  const quiz = await this.quizRepo.findOne({ where: { id: quizId } });
  if (!quiz) {
    throw new NotFoundException('Quiz not found');
  }

  if (quiz.createdBy !== userId) {
    throw new ForbiddenException('You are not the creator of this quiz');
  }

  const question = this.questionRepo.create({
    text: data.text,
    timeLimit: data.timeLimit,
    image: data.image,
    quiz,
  });
  await this.questionRepo.save(question);

  for (const o of data.options) {
    const option = this.optionRepo.create({
      text: o.text,
      isCorrect: o.isCorrect,
      color: o.color,
      question,
    });
    await this.optionRepo.save(option);
  }

  return question;
}

async getQuizById(id: string) {
  return this.quizRepo.findOne({
    where: { id },
    relations: ['questions', 'questions.options'], // 👈 Load related data
  });
}
}

