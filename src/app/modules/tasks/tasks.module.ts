/** Angular core */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

/** Estado global */
import { StoreModule } from '@ngrx/store'

/** App imports */
import { TasksRoutingModule, TasksComponent, TaskComponent } from '@modules/tasks'
import { SharedModule } from '@shared/index'
import { TasksListComponent } from '@modules/tasks'
import { tasksReducer, tasksStateFeatureKey } from '@store/index'

@NgModule({
  declarations: [
    TasksComponent,
    TaskComponent,
    TasksListComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    SharedModule,
    StoreModule.forFeature(tasksStateFeatureKey, tasksReducer),
  ],
  exports: [
    TasksComponent
  ]
})
export class TasksModule { }
