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
  currentSortColumn: string = 'id';
  currentSortOrder: 'asc' | 'desc' = 'desc';
  isAscending: boolean = true;
  constructor(private taskService: TaskService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.taskService.getAllTasks();
    this.tasks$ = this.taskService.tasks$;
    this.sortTasks('id');
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(
      () => {
        console.log('Delete successful');
      },
      (error) => {
        console.error('Delete failed:', error);
      }
    );
  }
  markTaskAsDone(task: Task): void{
    this.taskService.markTaskDone(task).subscribe(
      (updatedTask) => {
        console.log('Task updated:', updatedTask);
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }
  sortTasks(column: string): void {
  if (this.currentSortColumn === column) {
    this.currentSortOrder = this.currentSortOrder === 'desc' ? 'asc' : 'desc';
  } else {
    this.currentSortColumn = column;
    this.currentSortOrder = 'asc';
  }
    this.tasks$ = this.tasks$.pipe(map((tasks) => this.sortTasksArray(tasks)));
  }
  private sortTasksArray(tasks: Task[]): Task[] {
    if (this.currentSortColumn === 'id') {
      return tasks.sort((a, b) => {
        const compareResult = this.currentSortOrder === 'asc' ? a.id - b.id : b.id - a.id;
        return compareResult;
      });
    } else if (this.currentSortColumn === 'title') {
      return tasks.sort((a, b) => {
        const compareResult = a.naslov.localeCompare(b.naslov);
        return this.currentSortOrder === 'asc' ? compareResult : -compareResult;
      });
      } 
    else if (this.currentSortColumn === 'desc') {
      return tasks.sort((a, b) => {
        const compareResult = a.opis.localeCompare(b.opis);
        return this.currentSortOrder === 'asc' ? compareResult : -compareResult;
      });

    }
    return tasks;
  }
  searchTasks(): void {
    console.log("Searching ... ", this.searchTerm); 
    if (this.searchTerm.trim() === '') {
      this.tasks$ = this.taskService.tasks$;
    } else {
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