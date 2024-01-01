import { Injector, runInInjectionContext } from '@angular/core';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject, firstValueFrom, map, timer } from 'rxjs';
import { TaskApi } from '../../api/task.api';
import { ToDoActions } from './task.actions';
import { TasksEffects } from './task.effects';
import { TaskState, initialState } from './task.reducer';

describe('TaskEffects', () => {
  describe('loadToDos', () => {
    it('should call "getTasks" action when the status is INITIAL', async () => {
      const { actions$, injector, mockToDoApi, mockStore } = createContext();

      mockStore.setState({ task: { status: 'INITIAL' } });

      await runInInjectionContext(injector, async () => {
        const effect = TasksEffects.loadTasks();

        const resultPromise = firstValueFrom(effect);
        actions$.next(ToDoActions.loadTasks);

        expect(await resultPromise).toEqual(ToDoActions.tasksLoaded({ tasks: [] }));
        expect(mockToDoApi.getTasks).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call "getTasks" action when the status is LOADED', async () => {
      const { actions$, injector, mockToDoApi, mockStore } = createContext();

      mockStore.setState({ task: { status: 'LOADED', tasks: [] } });

      await runInInjectionContext(injector, async () => {
        const effect = TasksEffects.loadTasks();

        const resultPromise = firstValueFrom(effect, { defaultValue: 'END' });
        actions$.next(ToDoActions.loadTasks);
        actions$.complete();

        expect(await resultPromise).toEqual('END');
        expect(mockToDoApi.getTasks).toHaveBeenCalledTimes(0);
      });
    });

    it('should call "getTasks" only once ', async () => {
      const { actions$, injector, mockToDoApi, mockStore } = createContext();

      mockStore.setState({ task: { status: 'INITIAL' } });

      await runInInjectionContext(injector, async () => {
        const effect = TasksEffects.loadTasks();

        const resultPromise = firstValueFrom(effect);
        actions$.next(ToDoActions.loadTasks);
        actions$.next(ToDoActions.loadTasks);

        expect(await resultPromise).toEqual(ToDoActions.tasksLoaded({ tasks: [] }));
        expect(mockToDoApi.getTasks).toHaveBeenCalledTimes(1);
      });
    });
  });
});

function createContext() {
  const actions$ = new Subject();
  const mockTaskApi = jasmine.createSpyObj<TaskApi>(TaskApi.name, ['getTasks']);

  mockTaskApi.getTasks.and.returnValue(timer(100).pipe(map(() => [])));

  const injector = Injector.create({
    providers: [
      provideMockStore({ initialState: { task: initialState } }),
      provideMockActions(() => actions$),
      { provide: TaskApi, useValue: mockTaskApi },
    ],
  });

  return {
    injector,
    actions$,
    mockToDoApi: mockTaskApi,
    mockStore: injector.get<MockStore<{ task: TaskState }>>(MockStore),
  };
}
