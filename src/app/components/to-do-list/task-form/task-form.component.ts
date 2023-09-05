import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import necessary modules
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  task: Task ; // Initialize with an empty object
  @Output() onSubmit = new EventEmitter<Task>(); // Output event
  isDisabled: boolean = false;

  taskForm: FormGroup; // Define the form as a FormGroup
  naslovValue: string = ''; // Variable to hold the 'naslov' value
  opisValue: string = '';   
  constructor(private fb: FormBuilder, private taskService: TaskService, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.taskForm = this.fb.group({
      naslov: ['', Validators.required],
      opis: ['', Validators.required]
        });
    console.log(this.taskForm.valid);
    this.route.params.subscribe((params) => {
      const taskId = +params['id'];
      if (taskId) {
        this.taskService.findTaskById(taskId).subscribe((task) => {
          if (task) {
            this.task = task;
            this.taskForm.patchValue({
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
      id: -1, // Assign a unique ID or set it to 0 for a new task
      naslov: '',
      opis: '',
      datumUstvarjanja: new Date(), // Set to the current date/time or the desired default date
      opravljeno: false, // Initial completion status
    };
  }
  onTaskSubmit(): void {
    console.log(this.taskForm.valid)
    if (this.taskForm.valid) {
      console.log(this.task);
      if (this.task.id != -1){
          console.log("edit")
        }
      
      else {
        const updatedTask: Task = {
           id: 0, // Make sure to include the task ID
           naslov: this.taskForm.get('naslov')!.value,
           opis: this.taskForm.get('opis')!.value,
           datumUstvarjanja: new Date(),
           opravljeno: false
        };
  
        this.taskService.createTask(updatedTask).subscribe(
          (createdTask) => {
            // Handle the response here
            console.log('Task created:', createdTask);
          },
          (error) => {
            // Handle error
            console.error('Error creating task:', error);
          }
        );
          }
        }

      }
  }
