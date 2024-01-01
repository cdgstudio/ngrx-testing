import { lastValueFrom, take } from 'rxjs';
import { TaskStore } from './rxjs';

describe('TaskStore (with done callback)', () => {
  it('should add two tasks ', () => {
    const store = new TaskStore();

    store.tasks$.pipe(take(1)).subscribe((tasks) => {
      expect(tasks.length).toEqual(0);
    });

    store.addTask('Buy some milk');
    store.addTask('Buy two eggs');

    store.tasks$.pipe(take(1)).subscribe((tasks) => {
      expect(tasks.length).toEqual(2);
    });
  });
});
