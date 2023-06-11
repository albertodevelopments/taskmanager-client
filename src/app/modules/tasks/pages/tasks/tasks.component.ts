/** Angular core */
import { Component, OnInit } from '@angular/core'
import { Observable, Subject, forkJoin, take } from 'rxjs'

/** Estado global */
import { Store } from '@ngrx/store';
import { fromProfileSelectors, fromTasksPageActions } from '@store/index';

/** App imports */
import { TasksService, TaskInterface } from '@modules/tasks'
import { ApiResponse, Employee, EmployeesService, Status, TasksState, getLocalePriorities } from '@core/index'
import { Project, ProjectsService } from '@modules/projects'
import { TranslationPipe } from '@shared/index'

/** Librerías */
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  providers: [MessageService, TranslationPipe]
})
export class TasksComponent implements OnInit{

  protected taskWindowOpen: boolean
  protected priorities: any[]
  // private _uid$: Observable<string>
  protected projectsList: Project[]
  protected employeesList: Employee[]
  // private _job$: Observable<string>
  private _uidAndJob$: Observable<any>
  protected userJob: string
  private _tasks: TaskInterface[]
  // protected pendingTasks: TaskInterface[]
  // protected inProgressTasks: TaskInterface[]
  // protected inReviewTasks: TaskInterface[]
  // protected completedTasks: TaskInterface[]
  protected showTaskWindowCondition: boolean
  private _closingTaskWindow: Subject<void>
  protected closingTaskWindow$: Observable<void>
  protected showTasksPanel: boolean
  protected pendingStatus: number = Status.TODO 
  protected inProgressStatus: number = Status.IN_PROGRESS
  protected reviewStatus: number = Status.REVIEW
  protected curretStatus: number

  constructor(
    private store: Store,
    private employeesService: EmployeesService,
    private projectsService: ProjectsService,
    private tasksService: TasksService,
    private messageService: MessageService,
    private translationPipe: TranslationPipe
  ){
    this.taskWindowOpen = false
    this.priorities = []
    // this._uid$ = this.store.select(fromProfileSelectors.uid)
    this.projectsList = []
    this.employeesList = []
    // this._job$ = this.store.select(fromProfileSelectors.job)
    this._uidAndJob$ = this.store.select(fromProfileSelectors.uidAndJob)
    this.userJob = ''
    this.showTaskWindowCondition = false
    this._closingTaskWindow = new Subject
    this.closingTaskWindow$ = this._closingTaskWindow.asObservable()
    this._tasks = []
    // this.pendingTasks = []
    // this.inProgressTasks = []
    // this.inReviewTasks = []
    this.showTasksPanel = false    
    // this.completedTasks = []
    this.curretStatus = 0
  }

  ngOnInit(): void {
    this.fetchProperties()
    this._uidAndJob$.pipe(take(1)).subscribe(response => {
      this.loadData(response.uid, response.job)
    })
  }

  fetchProperties(): void{
    this.store.select(fromProfileSelectors.language).pipe(take(1)).subscribe(language => {
      this.priorities = getLocalePriorities(language)
    })
  }

  loadData(uid: string, job: string): void{
    this.store.dispatch(fromTasksPageActions.loadingTasks())
    this.userJob = job
    forkJoin({
      employee: this.employeesService.getEmployee(uid),
      tasks: this.tasksService.getTasksWithEmployeeData()
    }).subscribe({
      next: (data: any) => {
        if(data.employee.status === 200 && data.tasks.status === 200){
          const employee: Employee = data.employee.message
          const tasks: TaskInterface[] = data.tasks.message
          const tasksState: TasksState = {
            tasks,
            currentTask: null
          }

          this.store.dispatch(fromTasksPageActions.tasksLoaded({newTasksState: tasksState}))

          // this.completedTasks = tasks.filter((task: TaskInterface) => task.status === Status.DONE)
          if(job === 'Manager'){
            /** La vista del manager contandrá una lista con los empleados a los 
             *  que asignar tareas
            */
            this.loadManagerWiew(employee)
          }else{
            /** La vista del empleado corriente no contendrá esa lista, y se guardarán
             *  sus datos en el empleado que guarda la tarea
             */
            this.loadRegularEmployeeView(employee)
          }
          // this.pendingTasks = tasks.filter((task: TaskInterface) => task.status === Status.TODO)
          // this.inProgressTasks = tasks.filter((task: TaskInterface) => task.status === Status.IN_PROGRESS)
          // this.inReviewTasks = tasks.filter((task: TaskInterface) => task.status === Status.REVIEW)

        }else{
          if(data.employee.status !== 200){
            this.showTaskError(data.employee)
          }
          if(data.tasks.status !== 200){
            this.store.dispatch(fromTasksPageActions.tasksLoadingFailed())
            this.showTaskError(data.tasks)
          }
        }        
      },
      error: () => {
        const error: ApiResponse = {
          status: 500,
          message: 'global.error.500'
        }
        this.showTaskError(error)
      }
    })
  }

  addNewTask(status: number): void{
    this.curretStatus = status
    this.taskWindowOpen = true
  }

  loadManagerWiew(currentEmployee: Employee): void{
    forkJoin({
      projects: this.projectsService.getProjectsByTeam(currentEmployee.team),
      employeesList: this.employeesService.getEmployeesByTeam(currentEmployee.team),
    })
    .subscribe({
      next: (data: any) => { 
        if(data.projects.status === 200 && data.employeesList.status === 200){
          this.projectsList = data.projects.message
          this.employeesList = data.employeesList.message
          this.showTaskWindowCondition = this.projectsList && this.projectsList.length > 0 &&
                                         this.employeesList && this.employeesList.length > 0
        }else{
          this.showTaskWindowCondition = false
          if(data.employeesList.status !== 200){
            this.showTaskError(data.employeesList)
          }
          if(data.projects.status !== 200){
            this.showTaskError(data.projects)
          }
        }       
      },
      error: () => {
        const error: ApiResponse = {
          status: 500,
          message: 'global.error.500'
        }
        this.showTaskError(error)
      }
    })
  }

  loadRegularEmployeeView(currentEmployee: Employee): void{
    this.projectsService.getProjectsByTeam(currentEmployee.team).subscribe({
      next: (response: ApiResponse) => {
        if(response.status === 200){
          this.projectsList = response.message
          this.showTaskWindowCondition = this.projectsList && this.projectsList.length > 0
        }else{
          this.showTaskError(response)
        }
      },
      error: () => {
        const error: ApiResponse = {
          status: 500,
          message: 'global.error.500'
        }
        this.showTaskError(error)
      }
    })
  }

  saveTask(task: TaskInterface): void{
    this.tasksService.saveTask(task).subscribe({
      next: (response: ApiResponse) => {
        if(response.status === 200){
          this.showTaskSuccess(response)  
          this._closingTaskWindow.next()
        }else{
          this.showTaskError(response)  
        }
      },
      error: () => {
        const error: ApiResponse = {
          status: 500,
          message: 'global.error.500'
        }
        this.showTaskError(error)
      }
    })
  }

  completeTask(task: TaskInterface): void{
    this.store.dispatch(fromTasksPageActions.completingTask())
    this.tasksService.updateTask(task).subscribe({
      next: (response: ApiResponse) => {
        console.log(response)
        if(response.status !== 200){
          this.store.dispatch(fromTasksPageActions.taskCompletingFailed())
          this.showTaskError(response)  
        }else{
          console.log(response.message.id)
          this.store.dispatch(fromTasksPageActions.completeTask({currentTask: response.message}))
        }
      },
      error: () => {
        const error: ApiResponse = {
          status: 500,
          message: 'global.error.500'
        }
        this.showTaskError(error)
      }
    })
  }

  openTaskWindow(): void{
    this.taskWindowOpen = true
    this.curretStatus = Status.TODO
  }

  closeTaskWindow(): void{
    this.taskWindowOpen = false
  }

  showTaskError(apiResponse: ApiResponse): void{
    const translatedMessage = this.translationPipe.transform(apiResponse.message)
    const headerMessage = this.translationPipe.transform('task.error.header')

    this.messageService.add({ severity: 'error', summary: headerMessage, detail: translatedMessage })
  }

  showTaskSuccess(apiResponse: ApiResponse): void{
    const translatedMessage = this.translationPipe.transform(apiResponse.message)
    const headerMessage = this.translationPipe.transform('task.success.header')

    this.messageService.add({ severity: 'success', summary: headerMessage, detail: translatedMessage })
  }
}
