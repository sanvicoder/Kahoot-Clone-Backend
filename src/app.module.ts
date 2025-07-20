import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PlayerModule } from './player/player.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Player } from './player/player.entity';
import { QuizModule } from './quiz/quiz.module';
import { Quiz } from './quiz/quiz.entity';
import { Question } from './quiz/question.entity';
import { Option } from './quiz/option.entity';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 Loads .env and makes ConfigService global
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'mydb',
      entities: [User, Player, Quiz, Question, Option],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    PlayerModule,
    QuizModule,
  ],
})
export class AppModule {}

