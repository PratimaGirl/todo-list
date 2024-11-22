import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import User from '../models/user.model';
import { Router } from '@angular/router';

const AUTH_API = 'http://localhost:5000/api/user/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(AUTH_API + 'login', { email, password }, httpOptions)
      .pipe(
        tap((res: any) => {
          const user = res.user;
          this.user.next(user);
          localStorage.setItem('userData', JSON.stringify(user));
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + '',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/']);
    localStorage.removeItem('userData');
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.user.next(JSON.parse(userData));
    }
  }
}
