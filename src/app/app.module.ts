import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';
import { HttpClientModule } from '@angular/common/http';
import { TaskFormComponent } from './components/to-do-list/task-form/task-form.component'; // Import HttpClientModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoListComponent } from './components/to-do-list/todo-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskFormComponent,
    TodoListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [TaskService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
