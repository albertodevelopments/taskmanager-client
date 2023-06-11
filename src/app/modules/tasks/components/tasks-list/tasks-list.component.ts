import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'

/** App imports */
import { TranslationPipe } from '@shared/index'
import { TaskInterface } from '@modules/tasks'
import { Status, findTag, getDatesDifferenceInHours } from '@core/index'
import { Store } from '@ngrx/store'
import { fromProfileSelectors, fromTasksSelectors } from '@store/index'
import { Observable, map, take } from 'rxjs'

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  providers: [TranslationPipe]
})
export class TasksListComponent implements OnInit{

  @Input() status: number
  @Output() complete: EventEmitter<TaskInterface>
  @Output() addTask: EventEmitter<number>

  protected title: string
  protected quantity: number
  protected tags: any[]
  protected viewFormatTasks$: Observable<any[]>
  // protected viewFormatTasks: any[]
  protected tasks$: Observable<TaskInterface[]>
  private _tasks: TaskInterface[]

  constructor(
    private translationPipe: TranslationPipe,
    private store: Store
  ){
    this.tasks$ = new Observable<TaskInterface[]>
    this._tasks = []
    this.status = 0
    this.title = ''
    this.quantity = 0
    this.tags = []
    this.viewFormatTasks$ = new Observable<any[]>()
    // this.viewFormatTasks = []
    this.complete = new EventEmitter<TaskInterface>()
    this.addTask = new EventEmitter<number>()
  }

  ngOnInit(): void {
    this.retrieveTasksArray()
    this.tasks$.subscribe(tasks => {
      this._tasks = tasks
      console.log(tasks)
      this.store.select(fromProfileSelectors.language).pipe(take(1))
      .subscribe(language => {
        this.setTitle()
        this.quantity = this._tasks.length
        this.buildTagsArray()
        this.buildViewFormatTasksArray(language)
      })
    })
  }

  retrieveTasksArray(): void{
    switch(this.status){
      case Status.TODO:
        this.tasks$ = this.store.select(fromTasksSelectors.pendingTasks)
        break
      case Status.IN_PROGRESS:
        this.tasks$ = this.store.select(fromTasksSelectors.inProgressTasks)
        break
      case Status.REVIEW:
        this.tasks$ = this.store.select(fromTasksSelectors.inReviewTasks)
        break
      default:
        this.tasks$ = this.store.select(fromTasksSelectors.pendingTasks)
        break
    }
  }

  buildTagsArray(): void{
    this.tags = []
    this._tasks.forEach(task => {
      const tag1 = findTag(task.tag1)
      const tag2 = findTag(task.tag2)
      const tag3 = findTag(task.tag3)

      this.tags.push({
        taskId: task.id,
        name: tag1.name,
        color: tag1.color,
        background: tag1.background
      })
      tag2 && this.tags.push({
        taskId: task.id,
        name: tag2.name,
        color: tag2.color,
        background: tag2.background
      })
      tag3 && this.tags.push({
        taskId: task.id,
        name: tag3.name,
        color: tag3.color,
        background: tag3.background
      })
    })    
  }

  buildViewFormatTasksArray(language: string): void{
    /** Convertimos la tarea añadiendo los datos de la vista */
    // this.viewFormatTasks = this.tasks.map(task => {
    //   let tagsNumber = 0

    //   task.tag1 && tagsNumber++
    //   task.tag2 && tagsNumber++
    //   task.tag3 && tagsNumber++

    //   const lastDate = task.endAt ? new Date(task.endAt) : new Date()
    //   const difference = getDatesDifferenceInHours(new Date(task.startAt), lastDate)

    //   /** Formateamos la fecha de entrega (texto según idioma) */
    //   const dueDate = this.formatDate(task.dueDate, language)

    //   return{
    //     ...task,
    //     tagsRemaining: tagsNumber - 2,
    //     taskTime: difference,
    //     dueDate: task.dueDate === null ? null : new Date(task.dueDate),
    //     viewDueDate: dueDate.date,
    //     dateColor: dueDate.color
    //   }
    // })
    this.viewFormatTasks$ = this.tasks$.pipe(
      map((tasks: TaskInterface[]) => {
        return tasks.map(task => {
          let tagsNumber = 0

          task.tag1 && tagsNumber++
          task.tag2 && tagsNumber++
          task.tag3 && tagsNumber++

          const lastDate = task.endAt ? new Date(task.endAt) : new Date()
          const difference = getDatesDifferenceInHours(new Date(task.startAt), lastDate)

          /** Formateamos la fecha de entrega (texto según idioma) */
          const dueDate = this.formatDate(task.dueDate, language)

          return{
            ...task,
            tagsRemaining: tagsNumber - 2,
            taskTime: difference,
            dueDate: task.dueDate === null ? null : new Date(task.dueDate),
            viewDueDate: dueDate.date,
            dateColor: dueDate.color
          }
        })
      })
    )
  }

  formatDate(date: Date | null, language: string): any{

    if(date === null) return null

    const yesterday = new Date()
    const today = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if(new Date(date).getDate() === yesterday.getDate() &&
       new Date(date).getMonth() === yesterday.getMonth() &&
       new Date(date).getFullYear() === yesterday.getFullYear()){
      return {
        date: this.translationPipe.transform('global.dates.yesterday'),
        color: '#f14a5b'
      }
    }else if(new Date(date).getDate() === today.getDate() &&
             new Date(date).getMonth() === today.getMonth() &&
             new Date(date).getFullYear() === today.getFullYear()){
      return {
        date: this.translationPipe.transform('global.dates.today'),
        color: '#ff9f38'
      }
    }else{
      return{
        date: new Date(date).toLocaleDateString(language,  {year: 'numeric', month: 'short', day: 'numeric'}),
        color: ''
      }
    }
  }

  setTitle(): void{
    let beforeTranslationTitle = ''
    switch(this.status){
      case Status.TODO:
        beforeTranslationTitle = 'tasks.todo.title'
        break
      case Status.IN_PROGRESS:
        beforeTranslationTitle = 'tasks.in.progress.title'
        break
      case Status.REVIEW:
        beforeTranslationTitle = 'tasks.in.review.title'
        break
      // case Status.DONE:
      //   beforeTranslationTitle = 'tasks.completed.title'
      //   break
      default:
        beforeTranslationTitle = 'tasks.todo.title'
        break
    }
    this.title = this.translationPipe.transform(beforeTranslationTitle)
  }

  toggleCompleteTask(task: TaskInterface): void{
    const changedTask = {
      ...task,
      completed: !task.completed
    }
    this.complete.emit(changedTask)
  }

  newTask(): void{
    this.addTask.emit(this.status)
  }

}
