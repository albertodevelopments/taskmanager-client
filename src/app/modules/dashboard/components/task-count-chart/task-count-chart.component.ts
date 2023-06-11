/** Angular core */
import { Component, OnInit, Input } from '@angular/core'
import { getMonthNames } from '@core/index'

/** Store */
import { Store } from '@ngrx/store'
import { fromProfileSelectors } from '@store/index'

/** App import */
import { TaskInterface } from '@modules/tasks'
import { TranslationPipe } from '@shared/index'

/** Librerías */
import { ChartConfiguration } from 'chart.js'

@Component({
  selector: 'app-task-count-chart',
  templateUrl: './task-count-chart.component.html',
  styleUrls: ['./task-count-chart.component.scss'],
  providers: [TranslationPipe]
})
export class TaskCountChartComponent implements OnInit{

  @Input() tasksArray: TaskInterface[]

  private readonly MONTHS: number = 4
  protected data: ChartConfiguration<'bar'>['data']
  private monthsArray: string[]
  private monthsArrayInNumbers: number[]

  constructor(
    private store: Store,
    private translationPipe: TranslationPipe,
  ){
    this.tasksArray = []
    this.monthsArray = []
    this.monthsArrayInNumbers = []
    this.data = {
      labels: [],
      datasets: []
    }
  }

  ngOnInit(): void {
    this.store.select(fromProfileSelectors.language).subscribe(lang => {
      this.loadMonthsArray(lang)
      this.loadChart()
    })
    
  }

  /** Obtenemos los cinco últimos meses para mostrar los datos de
   *  cada uno de ellos
   */
  loadMonthsArray(language: string): void{
    const months = []
    const monthsInNumbers = []
    let currentMonth = new Date().getMonth() + 1
    let i = 0
    do{
      months[i] = this.getMonthName(language, currentMonth)
      monthsInNumbers[i] = currentMonth
      currentMonth = currentMonth > 1 ? currentMonth - 1 : 12 
      i++
    }while(i <= this.MONTHS)

    this.monthsArray = months.reverse()
    this.monthsArrayInNumbers = monthsInNumbers.reverse()
  }

  loadChart(): void{
    const completedTasksArray = this.monthsArrayInNumbers.map(month => {
      const total = this.tasksArray.filter(task => task.completed && new Date(task.startAt).getMonth() + 1 === month).length

      return total
    })

    const notCompletedTasksArray = this.monthsArrayInNumbers.map(month => {
      const total = this.tasksArray.filter(task => !task.completed && new Date(task.startAt).getMonth() + 1 === month).length

      return total
    })

    const completedLabel = this.translationPipe.transform('dashboard.tasks.completed')
    const notCompletedLabel = this.translationPipe.transform('dashboard.tasks.not.completed')

    this.data =  {
      labels: this.monthsArray,
      datasets: [
        { data: completedTasksArray, label: completedLabel, backgroundColor: '#6c5dd3', borderRadius: 5 },
        { data: notCompletedTasksArray, label: notCompletedLabel, backgroundColor: '#b6b6b6', borderRadius: 5 }
      ]
    }
  }

  getMonthName(language: string, month: number): string{
    const monthsByLanguage = getMonthNames()
    let monthName = ''
    
    switch(language){
      case 'en':
        monthName = monthsByLanguage.en[month - 1]
        break
      case 'es':
        monthName = monthsByLanguage.en[month - 1]
        break
      default: 
        monthName = monthsByLanguage.en[month - 1]
        break
    }

    return monthName
    
  }

  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    aspectRatio: 1.3,
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true
      }
    }
  }
  
}
