import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { MaterialComponentsModule } from './material-component.module';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app.routing';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';
import { HeaderComponent } from './header/header.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    LoginComponent, RegisterComponent,
    TodoDialogComponent,
    HeaderComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialComponentsModule,
    AppRoutingModule,
    DragDropModule,
  ],
  providers: [provideAnimations()],
  bootstrap: [AppComponent]
})
export class AppModule { }
