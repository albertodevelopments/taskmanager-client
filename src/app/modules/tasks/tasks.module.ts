/** Angular core */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

/** App imports */
import { TasksRoutingModule, TasksComponent } from '@modules/tasks'

@NgModule({
  declarations: [
    TasksComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule
  ],
  exports: [
    TasksComponent
  ]
})
export class TasksModule { }
