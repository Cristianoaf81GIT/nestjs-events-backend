import { Body, Controller, Logger, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../auth/profile.entity';
import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import { UserDTO } from './input/UserDTO';

@Controller('school')
export class TrainingController {
  private readonly logger = new Logger(TrainingController.name);
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  @Post('/create')
  public async savingRelation() {
    const subject = await this.subjectRepository.findOne(3);
    const teacher1 = await this.teacherRepository.findOne(1);
    const teacher2 = await this.teacherRepository.findOne(2);
    return await this.subjectRepository
      .createQueryBuilder()
      .relation(Subject, 'teachers')
      .of(subject)
      .add([teacher1, teacher2]);
  }

  @Post('/remove')
  public async removingRelation() {
    await this.subjectRepository
      .createQueryBuilder('s')
      .update()
      .set({ name: 'Confidential' })
      .execute();
  }

  @Post('/user')
  public async createUser(@Body() input: UserDTO): Promise<User> {
    const user = new User();
    user.username = input.username;
    user.email = input.email;
    user.firstName = input.firstName;
    user.lastName = input.lastName;
    user.password = input.password;
    let profile: Profile = new Profile();
    profile.age = input.age;
    // must be save profile on database first and then return a record
    let userProfile = await this.profileRepository.save(profile);
    user.profile = userProfile;
    return await this.userRepository.save(user);
  }
}
