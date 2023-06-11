/** Angular core */
import { NgModule } from '@angular/core'

/** App imports */
import { LayoutRoutingModule } from './layout-routing.module'
import { LayoutComponent, HeaderComponent, MenuComponent, ProfileComponent } from '@layout/index'
import { SharedModule } from '@shared/index'
import { DashboardModule } from '@modules/dashboard'
import { ProjectsModule } from '@modules/projects'
import { TasksModule } from '@modules/tasks'
import { ActivityModule } from '@modules/activity'
import { MessagesModule } from '@modules/messages';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    MenuComponent,
    ProfileComponent,
  ],
  imports: [
    SharedModule,
    LayoutRoutingModule,
    DashboardModule,
    ProjectsModule,
    TasksModule,
    ActivityModule,
    MessagesModule
  ],
})
export class LayoutModule { }
