import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import ToDo from '../models/task.model';
import { Router } from '@angular/router';

const AUTH_API = 'http://localhost:5000/api/task/';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient, private router: Router) {}

  createTodo(todo: ToDo): Observable<any> {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const authToken = userData.authToken;

    if (!authToken) {
      throw new Error('User not authenticated. Please log in again.');
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${authToken}` });

    return this.http.post(`${AUTH_API}`, todo, { headers }).pipe(
      catchError((error) => {
        console.error('Error in createTodo API:', error.message);
        throw error;
      })
    );
  }

  getToDos(): Observable<ToDo[]> {
    return this.http.get<{ todoTasks: ToDo[] }>(AUTH_API + '').pipe(
      map((res) => res.todoTasks),
      catchError((error) => this.handleError(error))
    );
  }

  getUserToDos(): Observable<ToDo[]> {
    const userData = localStorage.getItem('userData');

    if (!userData) {
      this.router.navigate(['/']);
      return throwError(() => new Error('User not authenticated'));
    }

    const { authToken, _id } = JSON.parse(userData);

    if (!authToken || !_id) {
      this.router.navigate(['/']);
      return throwError(
        () => new Error('Authentication failed. Please log in again.')
      );
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${authToken}` });

    return this.http
      .get<{ tasks: ToDo[] }>(`${AUTH_API}user/${_id}`, { headers })
      .pipe(
        map((res) => res.tasks || []),
        catchError((error) => this.handleError(error))
      );
  }

  editTodo(
    updatedTask: { title: string; description: string; status: string },
    id: string
  ): Observable<any> {
    const editUrl = `${AUTH_API}${id}`;

    return this.http
      .put(editUrl, updatedTask)
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteTodo(id: string): Observable<any> {
    let deleteUrl = `${AUTH_API}/${id}`;

    return this.http
      .delete(deleteUrl)
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    throw error;
  }
}
