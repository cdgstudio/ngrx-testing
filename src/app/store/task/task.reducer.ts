import { createFeature, createReducer, on } from '@ngrx/store';
import { Task } from '../../api/task.api';
import { ToDoActions } from './task.actions';

export interface InitialState {
  status: 'INITIAL';
}

export interface LoadingState {
  status: 'LOADING';
}

export interface LoadedState {
  status: 'LOADED';
  tasks: Task[];
}
export type TaskState = InitialState | LoadingState | LoadedState;

export const initialState: TaskState = {
  status: 'INITIAL',
};

export const taskFeature = createFeature({
  name: 'task',
  reducer: createReducer<TaskState>(
    initialState,
    on(ToDoActions.loadTasks, (state) => ({
      status: 'LOADING',
    })),
    on(ToDoActions.tasksLoaded, (state, { tasks }) => ({ status: 'LOADED', tasks })),
  ),
});

export const { selectTaskState } = taskFeature;
