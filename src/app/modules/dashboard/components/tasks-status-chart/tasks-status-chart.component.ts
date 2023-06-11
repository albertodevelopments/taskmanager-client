/** Angular core */
import { Component, Input, OnInit } from '@angular/core'
import { Status } from '@core/index'
import { TaskInterface } from '@modules/tasks'

/** Librerías */
import { ChartConfiguration } from 'chart.js'

@Component({
  selector: 'app-tasks-status-chart',
  templateUrl: './tasks-status-chart.component.html',
  styleUrls: ['./tasks-status-chart.component.scss']
})
export class TasksStatusChartComponent implements OnInit {

  @Input() tasksArray: TaskInterface[]

  protected datasets: ChartConfiguration<'doughnut'>['data']['datasets']
  protected pendingPercent: number
  protected inProgressPercent: number
  protected inReviewPercent: number
  protected completedPercent: number

  constructor(){
    this.tasksArray = []
    this.datasets = []
    this.pendingPercent = 0
    this.inProgressPercent = 0
    this.inReviewPercent = 0
    this.completedPercent = 0
  }

  ngOnInit(): void {
    this.loadChart()      
  }

  loadChart(): void{
    const totalTasks = this.tasksArray.length
    const pendingTasks = this.tasksArray.filter(task => task.status === Status.TODO).length
    const completedTasks = this.tasksArray.filter(task => task.status === Status.DONE).length
    const inProgressTasks = this.tasksArray.filter(task => task.status === Status.IN_PROGRESS).length
    const inReviewTasks = this.tasksArray.filter(task => task.status === Status.REVIEW).length

    if(totalTasks > 0){
      this.pendingPercent = Math.ceil(pendingTasks * 100 / totalTasks)
      this.inProgressPercent = Math.ceil(inProgressTasks * 100 / totalTasks)
      this.inReviewPercent = Math.ceil(inReviewTasks * 100 / totalTasks)
      this.completedPercent = Math.ceil(completedTasks * 100 / totalTasks)
    }
    
    this.datasets = [{
      data: [ pendingTasks, inProgressTasks, inReviewTasks, completedTasks ],      
      borderRadius: 5,
      backgroundColor: [
        '#a07dda',
        '#377dff',
        '#60b158',
        '#ff9f38'
      ]
    }]
  }

  public chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    aspectRatio: 1.3,
    responsive: true,
    cutout: 115
  }
}
