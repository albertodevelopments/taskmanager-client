import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiResponse, Status } from '@core/index';
import { Project } from '@modules/projects/interfaces/project.interface';
import { ProjectsService } from '@modules/projects/services/projects.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit{

  @Input() status: number
  @Output() showError: EventEmitter<ApiResponse>

  protected listOfTODOProjects: Project[]
  protected projectsInTodoStatus: number
  protected listOfInProgressProjects: Project[]
  protected projectsInInProgressStatus: number

  constructor(
    private projectsService: ProjectsService
  ){
    this.status = 0
    this.listOfTODOProjects = []
    this.projectsInTodoStatus = 0
    this.listOfInProgressProjects = []
    this.projectsInInProgressStatus = 0
    this.showError = new EventEmitter<ApiResponse>
  }

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe({
      next: (response: ApiResponse) => {
        if(response.status !== 200){
          this.showError.emit(response)
        }else{
          switch (this.status){
            case Status.TODO:
              this.listOfTODOProjects = response.message.filter((project: Project) => project.status === Status.TODO)
              this.projectsInTodoStatus = this.listOfTODOProjects.length
              break
            case Status.IN_PROGRESS:
              this.listOfInProgressProjects = response.message.filter((project: Project) => project.status === Status.IN_PROGRESS)
              this.projectsInInProgressStatus = this.listOfInProgressProjects.length
          }
        }
      },
      error: () => {
        const error: ApiResponse = {
          status: 200,
          message: 'global.error.500'
        }
        this.showError.emit(error)
      }
    })
  }

}
