/** Angular core */
import { Component, OnInit } from '@angular/core'
import { forkJoin } from 'rxjs'

/** App imports */
import { ApiResponse, Employee, EmployeesService, Status, teams } from '@core/index'
import { TranslationPipe } from '@shared/index'
import { TaskInterface, TasksService } from '@modules/tasks'

/** Librerías */
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService, TranslationPipe]
})
export class DashboardComponent implements OnInit{

  protected totalEmployees: number
  protected employeesPercentThisMonth: number
  protected tasksPercentThisMonth: number
  protected totalTasks: number
  protected completedTasks: number
  protected completedTasksPercentThisMonth: number
  protected pendingTasks: number
  protected pendingTasksPercentThisMonth: number
  protected employees: Employee[]
  protected employeesByTeam: number[]
  protected tasks: TaskInterface[]
  protected data: any
  protected options: any

  
  constructor(
    private employeesService: EmployeesService,
    private tasksService: TasksService,
    private messageService: MessageService,
    private translationPipe: TranslationPipe
  ){
    this.totalEmployees = 0
    this.employeesPercentThisMonth = 0
    this.tasksPercentThisMonth = 0
    this.employees = []
    this.tasks = []
    this.employeesByTeam = []
    this.totalTasks = 0
    this.completedTasks = 0
    this.completedTasksPercentThisMonth = 0    
    this.pendingTasks = 0
    this.pendingTasksPercentThisMonth = 0    
  }

  ngOnInit(): void {
    /**  obtener los diferentes datos del dashboard y entregarlos todos a la vez en un
     *  array de observables
    */
    forkJoin({
      employees: this.employeesService.getEmployees(),
      tasks: this.tasksService.getTasks()
    })
    .subscribe({
      next: (data: any) => {
        if(data.employees.status === 200){
          this.employees = data.employees.message
          this.loadEmployeesKpi()
          this.loadEmployeesKpiByTeam()    
          this.loadActualVsPredictedChart()
        }else{
          this.showDashboardError(data.employees)    
        }
        
        if(data.tasks.status !== 200){
          this.showDashboardError(data.tasks)
        }else{
          this.tasks = data.tasks.message
          this.loadTasksKpi()
        }
      },
      error: () => {
        const error = {
          status: 500,
          message: 'global.error.500'
        }
        this.showDashboardError(error)
      }
    })
  }

  loadActualVsPredictedChart(): void{    
    this.data = {
      datasets: [
          {
              data: [300, 50],
              backgroundColor: ['#6c5dd3', '#b6b6b6'],
              hoverBackgroundColor: ['#f6f2fc', '#efefef']
          }
      ]
    }

    this.options = {
      cutout: '70%',
    }

  }

  loadTasksKpi(){
    const thisMonth = new Date().getMonth()
    this.totalTasks = this.tasks.length
    const tasksThisMonth = this.tasks.filter((task: TaskInterface) => new Date(task.startAt).getMonth() === thisMonth).length
    if(this.totalTasks > 0){
      this.tasksPercentThisMonth = Math.floor(tasksThisMonth * 100 / this.totalTasks)
    }
    
    // const completedTasks: TaskInterface[] = this.tasks.filter((task: TaskInterface) => task.status === Status.DONE)
    const completedTasks: TaskInterface[] = this.tasks.filter((task: TaskInterface) => task.completed)
    this.completedTasks = completedTasks.length

    const completedTasksThisMonth = completedTasks.filter((task: TaskInterface) => new Date(task.startAt).getMonth() === thisMonth).length
    if(this.completedTasks > 0){
      this.completedTasksPercentThisMonth = Math.floor(completedTasksThisMonth * 100 / this.completedTasks)
    }

    const pendingTasks: TaskInterface[] = this.tasks.filter((task: TaskInterface) => task.status === Status.TODO)
    this.pendingTasks = pendingTasks.length

    const pendingTasksThisMonth = pendingTasks.filter((task: TaskInterface) => new Date(task.startAt).getMonth() === thisMonth).length
    if(this.pendingTasks > 0){
      this.pendingTasksPercentThisMonth = Math.floor(pendingTasksThisMonth * 100 / this.pendingTasks)
    }
  }

  loadEmployeesKpi(): void{
    const thisMonth = new Date().getMonth()
    this.totalEmployees = this.employees.length
    const employeesThisMonth = this.employees.filter((employee: Employee) => new Date(employee.startDate).getMonth() === thisMonth).length
    if(this.totalEmployees > 0){
      this.employeesPercentThisMonth = Math.floor(employeesThisMonth * 100 / this.totalEmployees)
    }
  }

  loadEmployeesKpiByTeam(): void{
    /** Inicializamos el array de departamentos */
    teams.forEach((team: any) => {
      this.employeesByTeam[team.id - 1] = 0
    })  

    this.employees.forEach((employee: Employee) => {
      teams.forEach((team: any) => {
        if(employee.team === team.id) {
          this.employeesByTeam[team.id - 1]++
        }
      })    
    })
  }

  showDashboardError(apiResponse: ApiResponse): void{
    const translatedMessage = this.translationPipe.transform(apiResponse.message)
    const headerMessage = this.translationPipe.transform('dashboard.error.header')

    this.messageService.add({ severity: 'error', summary: headerMessage, detail: translatedMessage })
  }
}
