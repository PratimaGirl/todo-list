import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.css'],
})
export class TodoDialogComponent {
  userForm: FormGroup;
  actionBtn: string = 'Save';
  userBtn: string = 'Add Task';
  constructor(
    private formBuilder: FormBuilder,
    private dataService: TaskService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<TodoDialogComponent>
  ) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Pending'],
      priority: ['low', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = 'Update';
      this.userBtn = 'Update Task';
      this.userForm.controls['title'].setValue(this.editData.title);
      this.userForm.controls['description'].setValue(this.editData.description);
      this.userForm.controls['status'].setValue(this.editData.status);
      this.userForm.controls['priority'].setValue(this.editData.priority);
    }
  }

  addTask() {
    if (!this.editData) {
      if (this.userForm.valid) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData._id;

        if (!userId) {
          alert('User not authenticated. Please log in again.');
          return;
        }

        const taskData = {
          ...this.userForm.value,
          userId,
        };

        this.dataService.createTodo(taskData).subscribe({
          next: (res) => {
            alert('Task Added Successfully');
            this.userForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => {
            console.error('Error Details:', err);
            alert('Error while adding the task');
          },
        });
      }
    } else {
      this.updateTask();
    }
  }

  updateTask() {
    const updatedTask = {
      title: this.userForm.value.title,
      description: this.userForm.value.description,
      status: this.userForm.value.status,
      priority: this.userForm.value.priority,
    };

    this.dataService.editTodo(updatedTask, this.editData._id).subscribe({
      next: (res) => {
        alert('Task Updated Successfully');
        console.log(res);
        this.userForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert('Error while updating the record!!');
      },
    });
  }
}
