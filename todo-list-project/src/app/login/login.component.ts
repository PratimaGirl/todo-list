import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import User from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoginMode = true;
  isSuccessful = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (data) => {
        this.isSuccessful = true;
        this.isLoginFailed = false;

        if (data && data.authToken && data.userId) {
          const userData: User = {
            _id: data.userId,
            username: '',
            email: data.email,
            password: '',
            authToken: data.authToken,
            isAdmin: data.isAdmin,
          };

          localStorage.setItem('userData', JSON.stringify(userData));

          this.authService.user.next(userData);

          setTimeout(() => {
            this.router.navigate(['/todoList']);
          }, 2000);
        } else {
          console.error('Invalid response format:', data);
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login failed';
        this.isLoginFailed = true;
      },
    });
  }
}
