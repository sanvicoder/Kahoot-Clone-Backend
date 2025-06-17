import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './player.entity';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Player]), JwtModule.register({ secret: 'jwtsecret' })],
  providers: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}