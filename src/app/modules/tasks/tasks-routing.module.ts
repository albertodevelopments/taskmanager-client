/** Angular core */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'

/** App imports */
import { TasksComponent } from '@modules/tasks'

const routes: Routes = [
  {path: '', component: TasksComponent},  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
