import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Question } from './question.entity';
import { Option } from './option.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { AddQuestionDto } from './dto/add-question.dto';
import { validate as isUUID } from 'uuid';

const COLORS = ['red', 'blue', 'green', 'yellow'];

function assignRandomColors(options: { text: string; isCorrect: boolean }[]) {
  const shuffled = [...COLORS].sort(() => 0.5 - Math.random());
  return options.map((opt, index) => ({
    ...opt,
    color: shuffled[index % COLORS.length],
  }));
}

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

      const coloredOptions = assignRandomColors(q.options);
      for (const o of coloredOptions) {
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
    if (!isUUID(quizId)) throw new BadRequestException('Invalid quiz ID format');

    const quiz = await this.quizRepo.findOne({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    if (quiz.createdBy !== userId) throw new ForbiddenException('Access denied');

    const question = this.questionRepo.create({
      text: data.text,
      timeLimit: data.timeLimit,
      image: data.image,
      quiz,
    });
    await this.questionRepo.save(question);

    const coloredOptions = assignRandomColors(data.options);
    for (const o of coloredOptions) {
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

  async updateQuestion(quizId: string, questionId: string, data: AddQuestionDto, userId: number) {
    console.log(data.options)
    if (!isUUID(quizId) || !isUUID(questionId)) {
      throw new BadRequestException('Invalid ID format');
    }

    const quiz = await this.quizRepo.findOne({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    if (quiz.createdBy !== userId) throw new ForbiddenException('Access denied');

    console.log(quiz)
    const question = await this.questionRepo.findOne({
      where: { id: questionId },
      relations: ['quiz'],
    });


    console.log(question)
    if (!question) throw new NotFoundException('Question not found');

    question.text = data.text;
    question.timeLimit = data.timeLimit;
    question.image = data.image || null;

    await this.optionRepo.delete({ question: { id: questionId } });

    const coloredOptions = assignRandomColors(data.options);
    console.log(coloredOptions)
    const newOptions = coloredOptions.map(o =>
      this.optionRepo.create({
        text: o.text,
        color: o.color,
        isCorrect: o.isCorrect,
        question,
      }),
    );
    await this.optionRepo.save(newOptions);
    console.log(newOptions)
    question.options = newOptions;
    console.log(question)
    return this.questionRepo.save(question);
  }

  async deleteQuestion(quizId: string, questionId: string, userId: number) {
    if (!isUUID(quizId) || !isUUID(questionId)) {
      throw new BadRequestException('Invalid ID format');
    }

    const quiz = await this.quizRepo.findOne({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    if (quiz.createdBy !== userId) throw new ForbiddenException('Access denied');

    const question = await this.questionRepo.findOne({
      where: { id: questionId },
      relations: ['quiz'],
    });


    if (!question) throw new NotFoundException('Question not found');

    await this.questionRepo.remove(question);
    return { message: 'Question deleted successfully' };
  }

  async getQuizById(id: string) {
    return this.quizRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });
  }
}
