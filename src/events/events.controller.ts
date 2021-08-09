import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './input/list-event';
import { PaginationResult } from 'src/pagination/pagination';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents): Promise<PaginationResult<Event>> {
    this.logger.log('Hit findAll route');
    const events =
      await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 2,
        },
      );
    this.logger.debug(`found ${events.data.length} events`);
    return events;
  }

  @Get('practice2')
  async practice2() {
    // return await this.repository.findOne(1, {
    //   relations: ['attendees'],
    // });
    const event = await this.repository.findOne(1, {
      relations: ['attendees'],
    });
    const attendee = new Attendee();
    attendee.name = 'Using cascade';
    //attendee.event = event;
    //event.attendees.push(attendee);
    event.attendees = [];
    //await this.attendeeRepository.save(attendee);
    await this.repository.save(event);
    return event;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    const event: Event = await this.eventsService.getEvent(id); //await this.repository.findOne(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async create(
    @Body() input: CreateEventDto,
    // eslint-disable-next-line @typescript-eslint/indent
    @CurrentUser() user: User,
  ): Promise<Event> {
    return await this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    // eslint-disable-next-line @typescript-eslint/indent
    @Body() input: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.repository.findOne(id);
    if (!event) {
      throw new NotFoundException();
    }
    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    const result = await this.eventsService.deleteEvent(id);
    if (result?.affected !== 1) {
      throw new NotFoundException();
    }
    //await this.repository.remove(event);
  }
}
