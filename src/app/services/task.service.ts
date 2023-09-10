import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5265/api/Task';

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetches all tasks from the API and updates the observable tasks$.
  getAllTasks(): void {
    this.http.get<Task[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Get All Tasks Error:', error);
          throw error; 
        })
      )
      .subscribe((tasks) => {
        this.tasksSubject.next(tasks);
      });
  }

  // Finds a task by its ID in the observable tasks$.
  findTaskById(taskId: number): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map((tasks) => tasks.find((task) => task.id === taskId))
    );
  }

  // Creates a new task and updates the observable tasks$ with the new task.
  createTask(task: Task): Observable<Task> {
    const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' };
    return this.http.post<Task>(this.apiUrl, task, { headers }).pipe(
      catchError((error) => {
        console.error('Create Error:', error);
        throw error; 
      }),
      tap((newTask) => {
        // When the POST request is successful, add the newTask to the existing tasks
        const currentTasks = this.tasksSubject.value;
        currentTasks.push(newTask);
        this.tasksSubject.next(currentTasks);
      })
    );
  }

  // Updates an existing task and updates the observable tasks$ with the updated task.
  updateTask(updatedTask: Task): Observable<Task> {
    const url = `${this.apiUrl}/${updatedTask.id}`;
    console.log(updatedTask);
    return this.http.put<Task>(url, updatedTask).pipe(
      catchError((error) => {
        console.error('Edit Error:', error);
        throw error;
      }),
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        const updatedIndex = currentTasks.findIndex((task) => task.id === updatedTask.id);
        if (updatedIndex !== -1) {
          currentTasks[updatedIndex] = updatedTask;
          this.tasksSubject.next([...currentTasks]);
        }
      })
    );
  }

  // Deletes a task by its ID and updates the observable tasks$ to remove the deleted task.
  deleteTask(taskId: number): Observable<void> {
    const url = `${this.apiUrl}/${taskId}`;
    console.log("Hello there delete");
    console.log(url);
    return this.http.delete<void>(url).pipe(
      catchError((error) => {
        console.error('Delete Error:', error);
        throw error; // Rethrow the error to propagate it to the component
      }),
      tap(() => {
        // When the DELETE request is successful, remove the corresponding task from the existing tasks
        const currentTasks = this.tasksSubject.value;
        const updatedTasks = currentTasks.filter((task) => task.id !== taskId);
        this.tasksSubject.next(updatedTasks);
      })
    );
  }

  // Marks a task as done and updates the observable tasks$ with the updated task.
  markTaskDone(doneTask: Task): Observable<void>{
    const url = `${this.apiUrl}/opravljeno/${doneTask.id}`;
    return this.http.put<void>(url, doneTask).pipe(
      catchError((error) => {
        console.error('Edit Error:', error);
        throw error;
      }),
      tap(() => {
        const currentTasks = this.tasksSubject.value;
        const updatedIndex = currentTasks.findIndex((task) => task.id === doneTask.id);
        if (updatedIndex !== -1) {
          currentTasks[updatedIndex].opravljeno = true;
          this.tasksSubject.next([...currentTasks]);
        }
      })
    );
  }
}