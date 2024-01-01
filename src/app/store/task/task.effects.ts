import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskApi } from '../../api/task.api';
import { ToDoActions } from './task.actions';
import { EMPTY, catchError, map, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectTaskState } from './task.reducer';

const loadTasks = createEffect(
  () => {
    const actions$ = inject(Actions);
    const toDoApi = inject(TaskApi);
    const store = inject(Store);

    return actions$.pipe(
      ofType(ToDoActions.loadTasks),
      switchMap(() => store.select(selectTaskState).pipe(take(1))),
      // here exhaustMap should be used
      switchMap((state) =>
        state.status === 'LOADED'
          ? EMPTY
          : toDoApi.getTasks().pipe(
              map((toDos) => ToDoActions.tasksLoaded({ tasks: toDos })),
              catchError(() => EMPTY),
            ),
      ),
    );
  },
  { functional: true },
);

export const TasksEffects = { loadTasks };
