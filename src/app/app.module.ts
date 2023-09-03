import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToDoListComponent } from './components/to-do-list.component';
import { TaskService } from './services/task.service';
import { HttpClientModule } from '@angular/common/http';
import { TaskFormComponent } from './components/task-form/task-form.component'; // Import HttpClientModule

@NgModule({
  declarations: [
    AppComponent,
    ToDoListComponent,
    TaskFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [TaskService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
