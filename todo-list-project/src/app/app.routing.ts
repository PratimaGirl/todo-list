import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { AuthGuard } from './auth.guard';
import { NotificationComponent } from './notification/notification.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'todoList', component: TodoListComponent, canActivate: [AuthGuard]},
  { path: 'notifications', component: NotificationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }