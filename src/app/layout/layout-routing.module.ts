/** Angular core */
import { NgModule } from '@angular/core'

/** Router */
import { RouterModule, Routes } from '@angular/router'

/** App imports */
import { LayoutComponent } from '@layout/index'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('@modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'projects',
        loadChildren: () => import('@modules/projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'tasks',
        loadChildren: () => import('@modules/tasks/tasks.module').then(m => m.TasksModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('@modules/messages/messages.module').then(m => m.MessagesModule)
      },
      {
        path: 'activity',
        loadChildren: () => import('@modules/activity/activity.module').then(m => m.ActivityModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
