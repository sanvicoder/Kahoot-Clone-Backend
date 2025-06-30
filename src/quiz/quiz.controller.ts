import { Body, Controller, Post, Req, UseGuards, Param, Get } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { AddQuestionDto } from './dto/add-question.dto';

@Controller('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  // ✅ Specific route comes first
  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreateQuizDto, @Req() req: Request) {
    const user = req.user as any;
    return this.quizService.createQuiz(body, user.userId);
  }

  // ✅ Specific route for adding question
  @Post(':quizId/add-question')
  @UseGuards(JwtAuthGuard)
  addQuestion(
    @Param('quizId') quizId: string,
    @Body() body: AddQuestionDto,
    @Req() req: Request
  ) {
    const user = req.user as any;
    return this.quizService.addQuestionToQuiz(quizId, body, user.userId);
  }

  // ✅ Generic route comes last
  @Get(':id')
  getQuiz(@Param('id') id: string) {
    return this.quizService.getQuizById(id);
  }
}




