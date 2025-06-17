import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import {Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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