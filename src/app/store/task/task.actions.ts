import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task } from '../../api/task.api';

export const ToDoActions = createActionGroup({
  source: 'TASK',
  events: {
    'load tasks': emptyProps(),
    'tasks loaded': props<{ tasks: Task[] }>(),
  },
});
