/** Angular core */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable, Subscription } from 'rxjs'

/** App imports */
import { Status } from '@core/index'
import { Project, ProjectsService } from '@modules/projects'
import { tags } from '@core/index'

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

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
  private closingWindowSubscription: Subscription

  constructor(
    private formBuilder: FormBuilder,
    private projectsService: ProjectsService
  ){
    this.projectForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      tag1Text: new FormControl('', [Validators.required]),
      tag2Text: new FormControl(''),
      tag3Text: new FormControl('')
    })
    this.closingWindow = false
    this.close = new EventEmitter<boolean>(false)
    this.canCloseWindow = new Observable<void>
    this.closingWindowSubscription = new Subscription()
    this.saveProject = new EventEmitter<Project>
    this.tag2Shown = false
    this.tag3Shown = false
    this.initialTags = tags
    this.tags1 = tags
    this.tags2 = tags
    this.tags3 = tags

  }

  ngOnInit(): void {
    this.closingWindowSubscription = this.canCloseWindow.subscribe(() => this.closeWindow())
  }

  get name(): FormControl{
    return this.projectForm.get('name') as FormControl
  }

  get description(): FormControl{
    return this.projectForm.get('description') as FormControl
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
      name: formData.name,
      description: formData.description,
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
    this.tags2 = this.initialTags.filter(tag => tag.id !== this.tag1Text.value)
  }

  showTag3(): void{
    this.tag3Shown = true

    /** Eliminamos el tag seleccionado en las dos primeras opciones del array de tags de la tercera */
    this.tags3 = this.initialTags.filter(tag => tag.id !== this.tag1Text.value && tag.id !== this.tag2Text.value)
  }

  changeTags(): void{
    /** Eliminamos el tag seleccionado en las otras dos opciones del array de tags actual */
    this.tags1 = this.initialTags.filter(tag => tag.id !== this.tag2Text.value && tag.id !== this.tag3Text.value)
    this.tags2 = this.initialTags.filter(tag => tag.id !== this.tag1Text.value && tag.id !== this.tag3Text.value)
    this.tags3 = this.initialTags.filter(tag => tag.id !== this.tag1Text.value && tag.id !== this.tag2Text.value)
  }
}
