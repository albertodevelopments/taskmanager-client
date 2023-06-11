/** Angular core */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable, Subscription, take, } from 'rxjs'

/** Estado global */
import { Store } from '@ngrx/store'
import { fromProfileSelectors } from '@store/index'

/** App imports */
import { tags, Employee, Status, getDateFormat } from '@core/index'
import { Project } from '@modules/projects'
import { TaskInterface } from '@modules/tasks'

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit{

  @Input() projectsList: Project[]
  @Input() employeesList: Employee[]
  @Input() employeeJob: string
  @Input() priorities: any[]
  @Input() canCloseWindow: Observable<void>
  @Input() status: number
  @Output() save: EventEmitter<TaskInterface>
  @Output() close: EventEmitter<void>

  protected taskForm: FormGroup
  protected tag2Shown: boolean
  protected tag3Shown: boolean
  protected tags1: any[]
  protected tags2: any[]
  protected tags3: any[]
  protected initialTags: any[]
  protected closingWindow: boolean
  private _uid$: Observable<string>
  private _language$: Observable<string>
  private _employeeId: string
  protected dateFormat: string
  protected today: Date

  /** Para suscribirse al observable en el padre de cierre de la ventata */
  private _closingWindowSubscription: Subscription

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
  ){
    this.taskForm = this.formBuilder.group({
      employee: new FormControl(''),
      project: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      dueDate: new FormControl(null, [Validators.required]),
      tag1Text: new FormControl(null, [Validators.required]),
      tag2Text: new FormControl(0),
      tag3Text: new FormControl(0),
      priority: new FormControl(0),
      points: new FormControl(0)
    })
    this.projectsList = []
    this.employeesList = []
    this.employeeJob = ''
    this.tag2Shown = false
    this.tag3Shown = false
    this.initialTags = tags
    this.tags1 = tags
    this.tags2 = tags
    this.tags3 = tags
    this.priorities = []
    this.closingWindow = false
    this.close = new EventEmitter<void>()
    this._uid$ = this.store.select(fromProfileSelectors.uid).pipe(take(1))
    this.save = new EventEmitter<TaskInterface>
    this.canCloseWindow = new Observable<void>
    this._closingWindowSubscription = new Subscription()
    this._employeeId = ''    
    this._language$ = this.store.select(fromProfileSelectors.language).pipe(take(1))
    this.dateFormat = 'mm/dd/yy'
    this.today = new Date()
    this.status = 0
  }

  ngOnInit(): void {

    this._language$.subscribe(language => {
      this.dateFormat = getDateFormat(language)
    })

    if(this.employeeJob !== 'Manager'){
      this.points.disable()            
    }else{
      this._uid$.subscribe(uid => {
        this._employeeId = uid
      })
      this.employee.setValidators([Validators.required])
      this.points.enable()
    }

    /** Cerramos el proyecto emitiendo la orden desde el padre */
    this._closingWindowSubscription = this.canCloseWindow.pipe(take(1)).subscribe(() => this.closeWindow())
    console.log(this.status)
  }

  saveTask(): void{
    const employeeId: string = this.employeeJob === 'Manager' ? this.employee.value : this._employeeId
    const task: TaskInterface = {
      id: '',
      projectId: this.project.value,
      employeeId,
      name: this.name.value,
      description: this.description.value,
      startAt: this.startDate.value,
      endAt: null,
      dueDate: this.dueDate.value,
      tag1: this.tag1Text.value,
      tag2: this.tag2Text.value,
      tag3: this.tag3Text.value,
      status: this.status,
      completed: false,
      priority: this.priority.value,
      taskPoints: this.points.value,
    }
    this.save.emit(task)    
  }

  closeWindow(){
    this.closingWindow = true
    
    /** Dejamos pasar los 600 milisegundos que dura la animación de cierre antes
     *  de salir de la ventana (dando un poco de margen)
     */
    setInterval(() => {
      this.close.emit()
    }, 500)
  }

  get employee(): FormControl{
    return this.taskForm.get('employee') as FormControl
  }

  get project(): FormControl{
    return this.taskForm.get('project') as FormControl
  }

  get name(): FormControl{
    return this.taskForm.get('name') as FormControl
  }

  get description(): FormControl{
    return this.taskForm.get('description') as FormControl
  }

  get startDate(): FormControl{
    return this.taskForm.get('startDate') as FormControl
  }

  get dueDate(): FormControl{
    return this.taskForm.get('dueDate') as FormControl
  }

  get tag1(): FormControl{
    return this.taskForm.get('tag1') as FormControl
  }

  get tag2(): FormControl{
    return this.taskForm.get('tag2') as FormControl
  }

  get tag3(): FormControl{
    return this.taskForm.get('tag3') as FormControl
  }

  get priority(): FormControl{
    return this.taskForm.get('priority') as FormControl
  }

  get points(): FormControl{
    return this.taskForm.get('points') as FormControl
  }

  get tag1Text(): FormControl{
    return this.taskForm.get('tag1Text') as FormControl
  }

  get tag2Text(): FormControl{
    return this.taskForm.get('tag2Text') as FormControl
  }

  get tag3Text(): FormControl{
    return this.taskForm.get('tag3Text') as FormControl
  }

  showTag2(): void{
    this.tag2Shown = true

    /** Eliminamos el tag seleccionado en la primera opción del array de tags de la segunda */
    this.tags2 = this.initialTags.filter(tag => tag.id !== parseInt(this.tag1Text.value))
  }

  showTag3(): void{
    this.tag3Shown = true

    /** Eliminamos el tag seleccionado en las dos primeras opciones del array de tags de la tercera */
    this.tags3 = this.initialTags.filter(tag => tag.id !== parseInt(this.tag1Text.value) && tag.id !== parseInt(this.tag2Text.value))
  }

  changeTags(): void{
    /** Eliminamos el tag seleccionado en las otras dos opciones del array de tags actual */
    this.tags1 = this.initialTags.filter(tag => tag.id !== parseInt(this.tag2Text.value) && tag.id !== parseInt(this.tag3Text.value))
    this.tags2 = this.initialTags.filter(tag => tag.id !== parseInt(this.tag1Text.value) && tag.id !== parseInt(this.tag3Text.value))
    this.tags3 = this.initialTags.filter(tag => tag.id !== parseInt(this.tag1Text.value) && tag.id !== parseInt(this.tag2Text.value))
  }
}

