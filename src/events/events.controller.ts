import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';

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
  async findAll(): Promise<Event[]> {
    this.logger.log('Hit findAll route');
    const events = await this.repository.find();
    this.logger.debug(`found ${events.length} events`);
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
  async create(@Body() input: CreateEventDto): Promise<Event> {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
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
    const event = await this.repository.findOne(id);
    if (!event) {
      throw new NotFoundException();
    }
    await this.repository.remove(event);
  }
}
