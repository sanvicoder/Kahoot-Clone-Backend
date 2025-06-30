import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(@InjectRepository(Player) private repo: Repository<Player>) {}

  async join(nickname: string) {
    const player = this.repo.create({ nickname });
    return this.repo.save(player);
  }
}
