import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  task: Task;
  @Output() onSubmit = new EventEmitter<Task>();
  isDisabled: boolean = false;

  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      naslov: ['', [Validators.required]],
      opis: ['', [Validators.required]]
    });

    this.route.params.subscribe((params) => {
      const taskId = +params['id'];
      if (taskId) {
        this.taskService.findTaskById(taskId).subscribe((task) => {
          if (task) {
            this.task = task;
            this.taskForm.setValue({
              naslov: task.naslov,
              opis: task.opis
            });
          } else {
            this.initializeNewTask();
          }
        });
      } else {
        this.initializeNewTask();
      }
    });
  }

  initializeNewTask(): void {
    this.task = {
      id: -1,
      naslov: '',
      opis: '',
      datumUstvarjanja: new Date(),
      opravljeno: false
    };
  }
  navigateToRoot(): void {
    this.router.navigate(['/']);
  }
  onTaskSubmit(): void {
    if (this.taskForm.valid) {
      if (this.task.id != -1) {
        this.task.naslov = this.taskForm.value.naslov;
        this.task.opis = this.taskForm.value.opis;

        this.taskService.updateTask(this.task).subscribe(
          (updatedTask) => {
            console.log('Task updated:', updatedTask);
            this.navigateToRoot();
          },
          (error) => {
            console.error('Error updating task:', error);
          }
        );
      } else {
        const updatedTask: Task = {
          id: 0,
          naslov: this.taskForm.value.naslov,
          opis: this.taskForm.value.opis,
          datumUstvarjanja: new Date(),
          opravljeno: false
        };

        this.taskService.createTask(updatedTask).subscribe(
          (createdTask) => {
            console.log('Task created:', createdTask);
            this.navigateToRoot();
          },
          (error) => {
            console.error('Error creating task:', error);
          }
        );
      }
    }
  }
}