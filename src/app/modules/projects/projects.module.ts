import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** App imports */
import { SharedModule } from '@shared/index'
import { ProjectsRoutingModule, ProjectComponent, ProjectsComponent } from '@modules/projects'

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule
  ],
  exports: [
    ProjectsComponent,
    ProjectComponent
  ]
})
export class ProjectsModule { }
