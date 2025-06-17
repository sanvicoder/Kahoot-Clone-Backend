import { Controller, Post, Body } from '@nestjs/common';
import { PlayerService } from './player.service';
import { JwtService } from '@nestjs/jwt';

@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService, private jwtService: JwtService) {}

  @Post('join')
  async join(@Body() body: { nickname: string }) {
    const player = await this.playerService.join(body.nickname);
    const payload = { sub: player.id, nickname: player.nickname, role: 'player' };
    const token = this.jwtService.sign(payload);
    return {
      token,
      player,
    };
  }
}