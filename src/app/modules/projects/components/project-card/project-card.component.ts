/** Angular core */
import { Component, Input, OnInit } from '@angular/core';
import { findTag } from '@core/index';

/** App imports */
import { Project } from '@modules/projects'
import { EmptyProject } from '@modules/projects/interfaces/project.interface';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit{
  @Input() project: Project

  protected tag1: any | null
  protected tag2: any | null 
  protected tag3: any | null

  constructor(){
    this.project = EmptyProject
    this.tag1 = null
    this.tag2 = null
    this.tag3 = null
  }

  ngOnInit(): void {
    this.loadProjectTags()    
  }

  loadProjectTags(): void{
    if(this.project.tag1 && this.project.tag1 !== 0){
      this.tag1 = findTag(this.project.tag1)
    }

    if(this.project.tag2 && this.project.tag2 !== 0){
      this.tag2 = findTag(this.project.tag2)
    }

    if(this.project.tag3 && this.project.tag3 !== 0){
      this.tag3 = findTag(this.project.tag3)      
    }
  }
}
