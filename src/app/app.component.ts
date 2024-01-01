import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ToDoActions } from './store/task';
import { selectTaskState } from './store/task/task.reducer';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private store = inject(Store);

  state = toSignal(this.store.select(selectTaskState));

  ngOnInit() {
    this.store.dispatch(ToDoActions.loadTasks());
  }
}
