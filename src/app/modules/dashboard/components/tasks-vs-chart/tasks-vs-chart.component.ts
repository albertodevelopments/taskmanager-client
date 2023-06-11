/** Angular core */
import { Component, OnInit, Input } from '@angular/core'
import { TaskInterface } from '@modules/tasks'

/** Librerías */
import { ChartConfiguration } from 'chart.js'

@Component({
  selector: 'app-tasks-vs-chart',
  templateUrl: './tasks-vs-chart.component.html',
  styleUrls: ['./tasks-vs-chart.component.scss'],
})
export class TasksVsChartComponent implements OnInit {

  @Input() tasksArray: TaskInterface[]

  protected datasets: ChartConfiguration<'doughnut'>['data']['datasets']
  protected percent: number

  constructor() {
    this.datasets = []
    this.tasksArray = []
    this.percent = 0
  }

  ngOnInit(): void {
    this.loadChart()    
  }

  loadChart(): void{
    const completedTasks = this.tasksArray.filter(task => task.completed).length
    const remainingTasks = this.tasksArray.length
    const totalTasks = completedTasks + remainingTasks
    this.percent = totalTasks === 0 ? 0 : Math.ceil(completedTasks / totalTasks)

    this.datasets = [{
      data: [ completedTasks, remainingTasks ],      
      circumference: 180,
      rotation: 270,
      borderRadius: 5,
      backgroundColor: [
        '#6c5dd3',
        '#e5e5e5'
      ]
    }]
  }

  public chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    aspectRatio: 5,
    cutout: 40    
  }
}
