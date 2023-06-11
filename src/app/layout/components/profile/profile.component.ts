/** Angular core */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable, Subscription, take } from 'rxjs'

/** Estado global */
import { Store } from '@ngrx/store'

/** App imports */
import { Employee, getLocalTeams } from '@core/index'
import { fromProfileSelectors } from '@store/index'
import { TranslationPipe } from '@shared/index'
import { teams } from '@core/index'

/** Librerías */
import { ConfirmationService } from 'primeng/api'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ConfirmationService, TranslationPipe]
})
export class ProfileComponent implements OnInit, OnDestroy{

  @Input() currentEmployee: Employee | null
  @Input() canCloseWindow: Observable<void>
  @Output() close: EventEmitter<boolean>
  @Output() saveEmployee: EventEmitter<Employee | null>
  @Output() saveEmployeeWithLanguageChanged: EventEmitter<Employee | null>

  protected profileForm: FormGroup
  protected avatar$: Observable<string>
  private previousLanguage: string
  protected closingWindow: boolean
  protected teams: any[]

  /** Para suscribirse al observable en el padre de cierre de la ventata */  
  private closingWindowSubscription: Subscription

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    public confirmationService: ConfirmationService,
    private translationPipe: TranslationPipe
  ){
    this.profileForm = this.formBuilder.group({
      email: new FormControl({value: '', disabled: true}),
      username: new FormControl('', [Validators.required]),
      job: new FormControl('', [Validators.required]),
      points: new FormControl({value: 0, disabled: true}),
      rol: new FormControl(''),
      team: new FormControl(null, [Validators.required]),
      language: new FormControl('', [Validators.required]),
    })
    this.teams = []
    this.previousLanguage = ''
    this.currentEmployee = null
    this.avatar$ = this.store.select(fromProfileSelectors.avatar)
    this.saveEmployee = new EventEmitter<Employee | null>
    this.saveEmployeeWithLanguageChanged = new EventEmitter<Employee | null>
    this.close = new EventEmitter<boolean>(false)
    this.closingWindow = false
    this.canCloseWindow = new Observable<void>
    this.closingWindowSubscription = new Subscription()
    this.teams = teams    
    this.store.select(fromProfileSelectors.language)
    .pipe(take(1))
    .subscribe(language => {
      this.teams = getLocalTeams(language)
    })
  }

  ngOnInit(): void {
    this.getCurrentEmployee()
    this.closingWindowSubscription = this.canCloseWindow.subscribe(() => this.closeWindow())
  }

  get username(): FormControl{
    return this.profileForm.get('username') as FormControl
  }

  get job(): FormControl{
    return this.profileForm.get('job') as FormControl
  }

  get rol(): FormControl{
    return this.profileForm.get('rol') as FormControl
  }

  get language(): FormControl{
    return this.profileForm.get('language') as FormControl
  }

  get team(): FormControl{
    return this.profileForm.get('team') as FormControl
  }

  getCurrentEmployee(): void {

    if(this.currentEmployee === null) return

    this.previousLanguage = this.currentEmployee.language

    /** Mostramos los datos en el formulario */
    this.profileForm.patchValue({
      username: this.currentEmployee.name,
      email: this.currentEmployee.email,
      job: this.currentEmployee.job,
      points: this.currentEmployee.points,
      rol: this.currentEmployee.rol,
      language: this.currentEmployee.language,
      team: this.currentEmployee.team === 0 ? null : this.currentEmployee.team
    })
  }

  save(): void{

    if(this.currentEmployee === null) {
      this.closeWindow()
      return
    }

    const newEmployee: Employee | null = {
      ...this.currentEmployee,
      name: this.username.value,
      job: this.job.value,
      rol: this.rol.value,
      language: this.language.value,
      team: this.team.value
    }

    if(this.previousLanguage !== this.language.value){
      this.confirmSaveLanguage(newEmployee)
    }else{
      this.saveEmployee.emit(newEmployee)
    }
  }

  confirmSaveLanguage(newEmployee: Employee | null){

    if(newEmployee === null) return

    const translatedMessage = this.translationPipe.transform('employee.confirm.save.language')
    const confirmationHeader =  this.translationPipe.transform('label.confirmation.message.header')

    this.confirmationService.confirm({
        message: translatedMessage,
        header: confirmationHeader,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.saveEmployeeWithLanguageChanged.emit(newEmployee)
        }
    })
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

  ngOnDestroy(): void {
    this.closingWindowSubscription.unsubscribe()
  }

}
