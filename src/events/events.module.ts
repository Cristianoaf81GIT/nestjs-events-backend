import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { AttendeeService } from './attendee.service';
//import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
//import { getEventsOrganizedByUserController } from './events-organized-by-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [EventsController], //, getEventsOrganizedByUserController, CurrentUserEventAttendanceController
  providers: [EventsService, AttendeeService],
})
export class EventsModule {}
