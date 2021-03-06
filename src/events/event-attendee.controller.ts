import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { Attendee } from './attendee.entity';
import { AttendeeService } from './attendee.service';

@Controller('events/:eventId/attendees')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventAttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @Param('eventId', ParseIntPipe) eventId: number,
  ): Promise<Attendee[]> {
    return await this.attendeeService.findByEventId(eventId);
  }
}
