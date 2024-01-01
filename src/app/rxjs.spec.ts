import { firstValueFrom, take } from 'rxjs';
import { TaskStore } from './rxjs';

describe('TaskStore (with promises)', () => {
  it('should add two tasks', async () => {
    const store = new TaskStore();

    const initialState = await firstValueFrom(store.tasks$);
    expect(initialState.length).toEqual(0);

    store.addTask('Buy some milk');
    store.addTask('Buy two eggs');

    const nextState = await firstValueFrom(store.tasks$);
    expect(nextState.length).toEqual(2);
  });

  it('should return only completed tasks', async () => {
    const store = new TaskStore();

    const task1 = store.addTask('Buy some milk');
    const task2 = store.addTask('Buy two eggs');

    store.completeTask(task2.id);

    const onlyCompleted = await firstValueFrom(store.completedTasks$);

    expect(onlyCompleted.length).toEqual(1);
    expect(onlyCompleted[0].completed).toBeTrue();
  });
});
