//import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import * as paginator from './../pagination/pagination';
//import { Test } from '@nestjs/testing';

jest.mock('./../pagination/pagination');

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;
  let selectQb;
  let deleteQb;
  let mockedPaginated;

  beforeEach(async () => {
    mockedPaginated = paginator.paginate as jest.Mock;
    // const module = await Test.createTestingModule({
    //   providers: [
    //     EventsService,
    //     {
    //       provide: getRepositoryToken(Event),
    //       useValue: {
    //         save: jest.fn(),
    //         createQueryBuilder: jest.fn(),
    //         delete: jest.fn(),
    //         where: jest.fn(),
    //         execute: jest.fn(),
    //       },
    //     },
    //   ],
    // }).compile();
    // service = module.get<EventsService>(EventsService);
    // repository = module.get<Repository<Event>>(getRepositoryToken(Event));
    const repo = new Repository<Event>();
    service = new EventsService(repo);
    repository = repo;
    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    };
    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    };
    //const createQueryBuilder = jest.fn().mockReturnValue(selectQb);
    // const delete = jest.fn().mockReturnValue(deleteQb);
  });
  describe('UpdateEvent', () => {
    it('should update the event', async () => {
      const repoSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ id: 1 } as Event);
      expect(
        service.updateEvent(new Event({ id: 1 }), { name: 'New Name' }),
      ).resolves.toEqual({ id: 1 });
      expect(repoSpy).toBeCalledWith({ id: 1, name: 'New Name' });
    });
  });
  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const createQueryBuilderSpy = jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(selectQb);
      const deleteSpy = jest.spyOn(selectQb, 'delete');
      const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb);
      const executeSpy = jest.spyOn(deleteQb, 'execute');
      expect(service.deleteEvent(1)).resolves.toBe(undefined);
      expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1);
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('e');

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('id = :id', { id: 1 });
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('getEventsAttenddedByUserIdPaginated', () => {
    it('should return a list of paginated events', async () => {
      const queryBuilderSpy = jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(selectQb);
      const orderBySpy = jest
        .spyOn(selectQb, 'orderBy')
        .mockReturnValue(selectQb);
      const leftJoinSpy = jest
        .spyOn(selectQb, 'leftJoinAndSelect')
        .mockReturnValue(selectQb);
      const whereSpy = jest.spyOn(selectQb, 'where').mockReturnValue(selectQb);
      mockedPaginated.mockResolvedValue({
        first: 1,
        last: 1,
        total: 10,
        limit: 10,
        data: [],
      });
      expect(
        service.getEventsAttendedByUserIdPaginated(500, {
          limit: 1,
          currentPage: 1,
        }),
      ).resolves.toEqual({
        data: [],
        first: 1,
        last: 1,
        limit: 10,
        total: 10,
      });

      expect(queryBuilderSpy).toBeCalledTimes(1);
      expect(queryBuilderSpy).toBeCalledWith('e');

      expect(orderBySpy).toBeCalledTimes(1);
      expect(orderBySpy).toBeCalledWith('e.id', 'DESC');

      expect(leftJoinSpy).toBeCalledTimes(1);
      expect(leftJoinSpy).toBeCalledWith('e.attendees', 'a');

      expect(whereSpy).toBeCalledTimes(1);
      expect(whereSpy).toBeCalledWith('a.userId = :userId', { userId: 500 });

      expect(mockedPaginated).toBeCalledTimes(1);
      expect(mockedPaginated).toBeCalledWith(selectQb, {
        currentPage: 1,
        limit: 1,
      });
    });
  });
});
