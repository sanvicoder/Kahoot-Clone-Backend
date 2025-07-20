import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import {Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { S3Service } from 'src/s3.service';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('Only image files are allowed'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const url = await this.s3Service.uploadFile(file);
    return { url };
  }
}


@Controller('admin')
export class UserController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const hash = await bcrypt.hash(body.password, 10);
    const user = await this.userService.create(body.email, hash);
    return user;
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) return { error: 'Invalid credentials' };
    return this.authService.login(user);
  }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@Request() req) {
    return req.user;
    }
}