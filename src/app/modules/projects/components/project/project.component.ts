/** Angular core */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable, Subscription, take } from 'rxjs'


/** Estado global */
import { Store } from '@ngrx/store'
import { fromProfileSelectors } from '@store/index'

/** App imports */
import { Status } from '@core/index'
import { Project } from '@modules/projects'
import { tags } from '@core/index'

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {

  @Input() canCloseWindow: Observable<void>
  @Output() close: EventEmitter<boolean>
  @Output() saveProject: EventEmitter<Project>

  protected projectForm: FormGroup
  protected closingWindow: boolean
  protected tag2Shown: boolean
  protected tag3Shown: boolean
  protected tags1: any[]
  protected tags2: any[]
  protected tags3: any[]
  protected initialTags: any[]

  /** Para suscribirse al observable en el padre de cierre de la ventata */
  private _closingWindowSubscription: Subscription

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
  ){
    this.projectForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      startDate: new FormControl(new Date().toLocaleDateString('en-US'), [Validators.required]),
      dueDate: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      tag1Text: new FormControl(null, [Validators.required]),
      tag2Text: new FormControl(0),
      tag3Text: new FormControl(0)
    })
    this.closingWindow = false
    this.close = new EventEmitter<boolean>(false)
    this.canCloseWindow = new Observable<void>
    this._closingWindowSubscription = new Subscription()
    this.saveProject = new EventEmitter<Project>
    this.tag2Shown = false
    this.tag3Shown = false
    this.initialTags = tags
    this.tags1 = tags
    this.tags2 = tags
    this.tags3 = tags
  }

  ngOnInit(): void {
    /** Obtenemos el idioma para cargar el formato de la fecha de inicio */
    this.store.select(fromProfileSelectors.language).pipe(take(1)).subscribe(language => {
      switch(language){
        case 'es':
          this.projectForm.get('startDate')?.setValue(new Date().toLocaleDateString('es-ES'))
          break
        case 'en':
          this.projectForm.get('startDate')?.setValue(new Date().toLocaleDateString('en-US'))
          break
        default:
          this.projectForm.get('startDate')?.setValue(new Date().toLocaleDateString('en-US'))
          break
      }
    })

    this._closingWindowSubscription = this.canCloseWindow.pipe(take(1)).subscribe(() => this.closeWindow())    
  }
  
  get name(): FormControl{
    return this.projectForm.get('name') as FormControl
  }

  get description(): FormControl{
    return this.projectForm.get('description') as FormControl
  }

  get startDate(): FormControl{
    return this.projectForm.get('startDate') as FormControl
  }

  get dueDate(): FormControl{

    return this.projectForm.get('dueDate') as FormControl
  }

  get tag1Text(): FormControl{
    return this.projectForm.get('tag1Text') as FormControl
  }

  get tag2Text(): FormControl{
    return this.projectForm.get('tag2Text') as FormControl
  }

  get tag3Text(): FormControl{
    return this.projectForm.get('tag3Text') as FormControl
  }

  submitProject(): void{
    const formData = this.projectForm.value
    const project: Project = {
      id: '',
      name: formData.name,
      description: formData.description,
      startAt: formData.startDate,
      dueDate: formData.dueDate,
      status: Status.TODO,
      tag1: formData.tag1Text,
      tag2: formData.tag2Text,
      tag3: formData.tag3Text
    }
    this.saveProject.emit(project)    
  }

  closeWindow(): void{
    this.closingWindow = true
    
    /** Dejamos pasar los 600 milisegundos que dura la animación de cierre antes
     *  de salir de la ventana (dando un poco de margen)
     */
    setInterval(() => {
      this.close.emit(true)
    }, 500)
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

  ngOnDestroy(): void {
    this._closingWindowSubscription.unsubscribe()
  }
}
