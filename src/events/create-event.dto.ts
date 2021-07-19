import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  id?: number;
  @IsString()
  @Length(5, 255, { message: 'The name length is wrong, minimum 5 characters' })
  name: string;
  @Length(5, 255)
  description: string;
  @IsDateString()
  when: Date;
  @Length(5, 255)
  address: string;
}
