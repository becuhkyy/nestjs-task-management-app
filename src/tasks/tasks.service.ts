import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}
  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.status.toLocaleLowerCase() === status.toLocaleLowerCase(),
  //     );
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.description
  //           .toLocaleLowerCase()
  //           .includes(search.toLocaleLowerCase()) ||
  //         task.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  //     );
  //   }
  //   return tasks;
  // }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id: id });

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);

    return task;
  }
  // deleteTask(id: string): void {
  //   const existingTask = this.getTaskById(id);
  //   //Sub-optimal, but if task not found in getTaskById()
  //   //we throw the NotFound exception there and we don't have to repeat it here
  //   //will be fixed when we introduce the ORM.
  //   this.tasks = this.tasks.filter((task) => task.id !== existingTask.id);
  // }
  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   //Bad, because we mutate the task
  //   //Will be fixed when we introduce the ORM.
  //   task.status = status;
  //   return task;
  // }
}
