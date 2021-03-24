import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { Test } from '@nestjs/testing';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

const mockUser = {
  username: 'Nastia',
  id: 1,
};

describe('TasksService', () => {
  let tasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();
    tasksService = await module.get<TasksService>(TasksService);
    tasksRepository = await module.get<TaskRepository>(TaskRepository);
  });
  describe('getTasks', () => {
    it('get all tasks from the repository', async () => {
        const value = 'someValue';
        tasksRepository.getTasks.mockResolvedValue(value);

        expect(tasksRepository.getTasks).not.toHaveBeenCalled();
        const searchQuery = 'Some search query';
        const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: searchQuery };
        const result = await tasksService.getTasks(filters, mockUser);
        expect(tasksRepository.getTasks).toHaveBeenCalledWith(filters, mockUser);
        expect(result).toEqual(value);
      },
    );
  });
  describe('getTaskById', () => {
    it('calls task.Repository and successfully retrieves and return the task', async () => {
      const title = 'Some title';
      const description = 'Some description';
      const mockTask = { title, description };
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });
    it('throws an error as task is not found', () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });
  describe('createTask', () => {
    it('creates a new task and returns a task', async () => {
      tasksRepository.createTask.mockResolvedValue('someTask');
      const mockCreateTaskDto: CreateTaskDto = {
        title: 'New task title',
        description: 'New task description',
      };
      const result = await tasksRepository.createTask(mockCreateTaskDto, mockUser);
      expect(tasksRepository.createTask).toHaveBeenCalledWith(mockCreateTaskDto, mockUser);
      expect(result).toEqual('someTask');
    });
  });
  describe('deleteTask', () => {
    it('should delete a task with a proper id after calling taskRepository.deleteTask()', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 1 });
      expect(tasksRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(tasksRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
    });
    it('throws an error if the task was not found', () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });
  describe('updateTaskStatus', () => {
    it('should update task status and return the task', async () => {
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});