import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(
        (task) =>
          task.status.toLocaleLowerCase() === status.toLocaleLowerCase(),
      );
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.description
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          task.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): void {
    const existingTask = this.getTaskById(id);
    //Sub-optimal, but if task not found in getTaskById()
    //we throw the NotFound exception there and we don't have to repeat it here
    //will be fixed when we introduce the ORM.
    this.tasks = this.tasks.filter((task) => task.id !== existingTask.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    //Bad, because we mutate the task
    //Will be fixed when we introduce the ORM.
    task.status = status;
    return task;
  }
}
