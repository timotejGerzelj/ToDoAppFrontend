import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TodoListComponent } from './components/to-do-list/todo-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/todolist', pathMatch: 'full' },
  { path: 'todolist', component: TodoListComponent },
  { path: 'task-form', component: TaskFormComponent },
  { path: 'task-form/:id', component: TaskFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
