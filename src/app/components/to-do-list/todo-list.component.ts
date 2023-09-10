import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  searchBar: FormGroup;
  

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService, 
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.searchBar = this.formBuilder.group({
      searchTerm: [''],
    });

    
    this.taskService.getAllTasks();
    this.tasks$ = this.taskService.tasks$;
    this.sortTasks('id');
  }

  // Delete a task by ID.
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

  // Mark a task as done when clicking the button.
  markTaskAsDone(task: Task): void {
    this.taskService.markTaskDone(task).subscribe(
      (updatedTask) => {
        console.log('Task updated:', updatedTask);
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }

  // Sort tasks based on the specified column.
  sortTasks(column: string): void {
    console.log(column)
    if (this.currentSortColumn === column) {
      this.currentSortOrder = this.currentSortOrder === 'desc' ? 'asc' : 'desc';
    } else {
      this.currentSortColumn = column;
      this.currentSortOrder = this.currentSortOrder === 'desc' ? 'asc' : 'desc';
    }
    this.tasks$ = this.tasks$.pipe(map((tasks) => this.sortTasksArray(tasks)));
  }

  //helper function to sort tasks.
  private sortTasksArray(tasks: Task[]): Task[] {
    console.log( "MEOW MEOW MEOW: ",this.currentSortOrder)
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
    } else if (this.currentSortColumn === 'desc') {
      return tasks.sort((a, b) => {
        const compareResult = a.opis.localeCompare(b.opis);
        return this.currentSortOrder === 'asc' ? compareResult : -compareResult;
      });
    }
    return tasks;
  }

  // When search icon is clicked searches task based on the provided word
  searchTasks(): void {
    const searchTerm = this.searchBar.get('searchTerm')?.value;
    console.log("Searching ... ", searchTerm);
  
    if (searchTerm === '') {
      this.tasks$ = this.taskService.tasks$;
    } else {
      console.log("Searching ...");
      this.tasks$ = this.taskService.tasks$.pipe(
        map((tasks) =>
          tasks.filter((task) =>
            task.naslov.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.opis.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    }
  }
  }
