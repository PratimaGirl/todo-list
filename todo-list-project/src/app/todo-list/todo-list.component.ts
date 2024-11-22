import { Component, ViewChild, OnInit } from '@angular/core';
import ToDo from '../models/task.model';
import { TaskService } from '../services/task.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  displayedColumns: string[] = [
    'id',
    'title',
    'description',
    'date',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<ToDo>();
  showCompleted = true;
  public newTodo: ToDo = new ToDo();
  editTodos: ToDo[] = [];

  constructor(private todoService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(priorityFilter?: string, showCompleted: boolean = true): void {
    this.todoService.getUserToDos().subscribe((todos) => {
      this.editTodos = todos;

      let filteredTodos = todos;

      if (priorityFilter) {
        filteredTodos = filteredTodos.filter(
          (task) => task.priority === priorityFilter
        );
      }

      if (!showCompleted) {
        filteredTodos = filteredTodos.filter((task) => task.status !== 'Done');
      }

      const priorityOrder = { high: 1, medium: 2, low: 3 };
      filteredTodos.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );

      this.dataSource.data = filteredTodos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.notifyHighPriorityTasks(todos);
    });
  }

  notifyHighPriorityTasks(todos: ToDo[]): void {
    const highPriorityTasks = todos.filter(
      (task) => task.priority === 'high' && task.status !== 'Done'
    );

    if (highPriorityTasks.length > 0) {
      highPriorityTasks.forEach((task) => {
        alert(
          `Reminder: Complete your task "${task.title}" as its priority is high!`
        );
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByPriority(priority: string): void {
    if (priority) {
      this.dataSource.data = this.editTodos.filter(
        (task) => task.priority === priority
      );
    } else {
      this.dataSource.data = [...this.editTodos];
    }
  }

  sortByPriority(): void {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    this.dataSource.data = [...this.dataSource.data].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }

  toggleCompletedTasks(showCompleted: boolean): void {
    if (showCompleted) {
      this.loadTodos();
    } else {
      this.dataSource.data = this.dataSource.data.filter(
        (task) => task.status !== 'Done'
      );
    }
  }

  create(): void {
    this.todoService.createTodo(this.newTodo).subscribe((res) => {
      this.loadTodos();
      this.newTodo = new ToDo();
    });
  }

  editTodo(todo: ToDo): void {
    if (!this.editTodos.includes(todo)) {
      this.editTodos.push(todo);
    } else {
      this.editTodos.splice(this.editTodos.indexOf(todo), 1);
      this.todoService.editTodo(todo, todo._id).subscribe(
        () => console.log('Update successful'),
        () => console.error('Update failed')
      );
    }
  }

  doneTodo(todo: ToDo): void {
    todo.status = 'Done';
    this.todoService.editTodo(todo, todo._id).subscribe(
      () => console.log('Marked as done'),
      () => console.error('Failed to mark as done')
    );
  }

  deleteTodo(todo: ToDo): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );
    if (confirmed) {
      this.todoService.deleteTodo(todo._id).subscribe(() => {
        this.loadTodos();
      });
    }
  }

  openDialog() {
    this.dialog
      .open(TodoDialogComponent, {
        width: '30%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.loadTodos();
        }
      });
  }

  editTask(element: ToDo): void {
    this.dialog
      .open(TodoDialogComponent, {
        width: '30%',
        data: element,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.loadTodos();
        }
      });
  }

  drag(event: CdkDragDrop<ToDo[]>): void {
    const currentData = this.dataSource.data;
    moveItemInArray(currentData, event.previousIndex, event.currentIndex);
    this.dataSource.data = currentData;
    this.saveOrderLocally(currentData);
  }

  saveOrderLocally(updatedTasks: ToDo[]): void {
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  }

  getCardBackgroundColor(element: any): string {
    switch (element.priority) {
      case 'medium':
        return '#FFEB3B';
      case 'high':
        return '#FF5720';
      default:
        return '#B9F3F5';
    }
  }

  getStatusColor(element: any): string {
    if (element.status === 'Pending') {
      return 'red';
    }
    return 'green';
  }
}
