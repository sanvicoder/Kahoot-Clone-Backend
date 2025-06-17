import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(@InjectRepository(Player) private repo: Repository<Player>) {}

  private generateJoinCode(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  async join(nickname: string) {
    const joinCode = this.generateJoinCode();
    const player = this.repo.create({ nickname, joinCode });
    return this.repo.save(player);
  }
}