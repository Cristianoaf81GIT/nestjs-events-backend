import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../auth/profile.entity';
import { User } from '../auth/user.entity';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import { TrainingController } from './training.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher, User, Profile])],
  controllers: [TrainingController],
})
export class SchoolModule {}
