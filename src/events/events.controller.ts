import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { UpdateEventDto } from './input/update-event.dto';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { ListEvents } from './input/list-event';
import { PaginationResult } from './../pagination/pagination';
import { CurrentUser } from './../auth/current-user.decorator';
import { User } from './../auth/user.entity';
import { AuthGuardJwt } from './../auth/auth-guard.jwt';

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
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

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    const event: Event = await this.eventsService.getEventWithAttendeeCount(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() input: CreateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return await this.eventsService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'You are not authorized to change this event',
      );
    }

    return await this.eventsService.updateEvent(event, input);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        'You are not authorized to remove this event',
      );
    }
    await this.eventsService.deleteEvent(id);
  }
}
