import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  tasks$: Observable<Task[]>;
  searchTerm: string = '';

  constructor(private taskService: TaskService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.taskService.getAllTasks();
    this.tasks$ = this.taskService.tasks$;
  }

  editTask(task: Task): void {
    console.log(task);
    // Implement edit logic (e.g., navigate to edit page with task ID)
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        console.log('Delete successful');
        // The tasks$ observable automatically updates in the service, so no need to update it here
      },
      (error) => {
        console.error('Delete failed:', error);
        // Handle the error (e.g., show an error message)
      }
    );
  }

  searchTasks(): void {
    console.log("Searching ... ", this.searchTerm); 

    if (this.searchTerm.trim() === '') {
      // If the search text is empty, reset the task list
    } else {
      // Filter tasks based on the search text
      console.log("Searching ..."); 
      this.tasks$ = this.taskService.tasks$.pipe(
        map((tasks) =>
          tasks.filter((task) =>
            task.naslov.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            task.opis.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
        )
      );
    }
  }
}