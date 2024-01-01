import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay } from 'rxjs';

export interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskApi {
  private http = inject(HttpClient);

  getTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`https://jsonplaceholder.typicode.com/todos`, {
        params: {
          _limit: 15,
        },
      })
      .pipe(delay(1_500));
  }
}
