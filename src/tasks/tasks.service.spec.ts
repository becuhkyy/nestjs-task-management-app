import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';

const mockTasksRepository = () => {
  return {
    getTasks: jest.fn(),
    findOneBy: jest.fn(),
  };
};

const mockUser = {
  id: 'someId',
  username: 'vesko',
  password: 'somePassword',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');

      const result = await tasksService.getTasks(null, null);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOneBy and returns the result', async () => {
      const mockTask = {
        id: 'someId',
        title: 'Test task',
        description: 'Test desc',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOneBy.mockResolvedValue({ ...mockTask });

      const result = await tasksService.getTaskById('someId', mockUser);

      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOneBy and handles an exception', async () => {
      tasksRepository.findOneBy.mockResolvedValue(null);

      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
