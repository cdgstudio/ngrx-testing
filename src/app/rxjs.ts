import { BehaviorSubject, map } from 'rxjs';

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

export class TaskStore {
  private static lastId = 0;

  private tasks$$ = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasks$$.asObservable();
  completedTasks$ = this.tasks$$.pipe(map((toDos) => toDos.filter((task) => task.completed)));

  addTask(description: string): Task {
    const task: Task = {
      id: ++TaskStore.lastId,
      completed: false,
      description,
    };

    this.tasks$$.next([task, ...this.tasks$$.getValue()]);

    return task;
  }

  completeTask(id: number): void {
    const tasks = this.tasks$$.getValue();
    const newTasks = tasks.map((task) => (task.id === id ? { ...task, completed: true } : task));

    this.tasks$$.next(newTasks);
  }

  removeAllTasks() {
    this.tasks$$.next([]);
  }
}
