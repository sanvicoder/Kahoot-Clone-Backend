import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Param,
  Get,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors, Module
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { AddQuestionDto } from './dto/add-question.dto';
import { S3Service } from 'src/s3.service'; // <-- import your S3 service

@Controller('quiz')
export class QuizController {
  constructor(
    private quizService: QuizService,
    private awsS3Service: S3Service, // <-- inject S3 service
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreateQuizDto, @Req() req: Request) {
    const user = req.user as any;
    return this.quizService.createQuiz(body, user.userId);
  }

  @Post(':quizId/add-question')
  @UseGuards(JwtAuthGuard)
  addQuestion(
    @Param('quizId') quizId: string,
    @Body() body: AddQuestionDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.quizService.addQuestionToQuiz(quizId, body, user.userId);
  }

  @Patch(':quizId/question/:questionId')
  @UseGuards(JwtAuthGuard)
  updateQuestion(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Body() body: AddQuestionDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.quizService.updateQuestion(
      quizId,
      questionId,
      body,
      user.userId,
    );
  }

  @Delete(':quizId/question/:questionId')
  @UseGuards(JwtAuthGuard)
  deleteQuestion(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.quizService.deleteQuestion(quizId, questionId, user.userId);
  }

  @Get(':id')
  getQuiz(@Param('id') id: string) {
    return this.quizService.getQuizById(id);
  }

  // --------- NEW ENDPOINT FOR IMAGE UPLOAD ----------
  @Post('upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file')) // file should be sent as "file" field
  async uploadQuizImage(@UploadedFile() file: Express.Multer.File) {
    // Upload to S3 and return the public URL
    const url = await this.awsS3Service.uploadFile(file);
    return { url }; // return the uploaded image URL
  }
}

