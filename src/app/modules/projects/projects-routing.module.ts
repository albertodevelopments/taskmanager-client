/** Angular core */
import { NgModule } from '@angular/core'

/** Routing */
import { RouterModule, Routes } from '@angular/router'

/** App imports */
import { ProjectsComponent, ProjectComponent } from '@modules/projects'

const routes: Routes = [
  {path: '', component: ProjectsComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
