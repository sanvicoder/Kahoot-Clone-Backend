import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';
import { Question } from './question.entity';
import { Option } from './option.entity';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { S3Service } from 'src/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question, Option])],
  providers: [QuizService, S3Service],
  controllers: [QuizController],
})
export class QuizModule {}
