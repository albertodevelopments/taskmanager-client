/** Angular */
import { Component, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

/** App imports */
import { AuthenticationService, ApiResponse, Employee, ProfileState, teams, getLocalTeams, EmployeesService } from '@core/index'
import { passwordsMustMatchValidator } from '@modules/authentication'
import { Registration } from '@modules/authentication/interfaces/registration.interface'
import { Store } from '@ngrx/store'
import { fromRegisterPageActions } from '@store/index'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'] 
})
export class SignupComponent {

  @Output() sendMessage: EventEmitter<ApiResponse>
  @Output() initApp: EventEmitter<ProfileState>

  protected registerForm: FormGroup
  protected teams: any[]

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private store: Store,
    private employeesService: EmployeesService
  ){
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      job: new FormControl('', [Validators.required]),
      genre: new FormControl('', [Validators.required]),
      language: new FormControl('', [Validators.required]),
      team: new  FormControl(null, [Validators.required]),
    }, {validators: passwordsMustMatchValidator})
    this.teams = []

    this.sendMessage = new EventEmitter<ApiResponse>()
    this.initApp = new EventEmitter<ProfileState>()
    this.teams = getLocalTeams('en')
  }

  get name(): FormControl{
    return this.registerForm.get('name') as FormControl
  }

  get email(): FormControl{
    return this.registerForm.get('email') as FormControl
  }

  get password(): FormControl{
    return this.registerForm.get('password') as FormControl
  }

  get confirmPassword(): FormControl{
    return this.registerForm.get('confirmPassword') as FormControl
  }

  get job(): FormControl{
    return this.registerForm.get('job') as FormControl
  }

  get genre(): FormControl{
    return this.registerForm.get('genre') as FormControl
  }

  get language(): FormControl{
    return this.registerForm.get('language') as FormControl
  }

  get team(): FormControl{
    return this.registerForm.get('team') as FormControl
  }


  register(): void{
    this.store.dispatch(fromRegisterPageActions.startRegister())
    this.registerForm.markAsPending()
    const registration: Registration = {
      'name': this.name.value,
      'email': this.email.value,
      'password': this.password.value,
      'job': this.job.value,
      'genre': this.genre.value,
      'language': this.language.value,
      'team': this.team.value
    }
    this.authenticationService.register(registration).subscribe({
      next: (response: ApiResponse) => {
        if(response.status === 200){
          /** Guardamos el token de autenticación en el store */
          const token = response.message
          this.store.dispatch(fromRegisterPageActions.registered({ newToken: token }))
          this.authenticate()        
        }else{
          this.sendMessage.emit(response)
        }
      },
      error: () => {
        const error: ApiResponse = {
          status: 500,
          message: 'global.error.500'
        }
        this.sendMessage.emit(error)
      }
    })
  }

  authenticate(): void{
    this.store.dispatch(fromRegisterPageActions.loadingUser())

    this.authenticationService.getAuthenticatedUser().subscribe({
      next: (response: ApiResponse) => this.authenticationResponse(response),
      error: () => {
        const error: ApiResponse = {
          status: 500,
          message: 'global.error.500'
        }
        this.sendMessage.emit(error)
      }
    })
  } 

  authenticationResponse(response: ApiResponse){
    if(response.status === 200){
      const backendEmployee: any = response.message
      const employee: Employee = {
        id: backendEmployee._id,
        name: backendEmployee.name,
        email: backendEmployee.email,
        avatar: backendEmployee.avatar,
        genre: backendEmployee.genre,
        job: backendEmployee.job,
        points: 0,
        rol: '',
        contacts: [],
        team: backendEmployee.team,
        language: backendEmployee.language,
        startDate: backendEmployee.startDate,
        tasks: backendEmployee.tasks
      }

      const profile: ProfileState = {
        name: employee.name,
        job: employee.job,
        uid: employee.id,
        avatar: employee.avatar,
        language: employee.language
      }

      this.store.dispatch(fromRegisterPageActions.userLoaded({ newProfile: profile }))
      this.authenticationService.fetchAvatarUrl(employee.genre).subscribe({
        next: (response: any) => {
          /** Error en la api random.me */
          if(response.error){
            this.sendMessage.emit({
              status: 500,
              message: 'login.error.500'
            })
            return
          }
  
          /** No hay error, cargamos el avatar y actualizamos el empleado */
          const employeeWithAvatar: Employee = {
            ...employee,
            avatar: response.results[0].picture.medium
          }
  
          this.store.dispatch(fromRegisterPageActions.updatingUser())
          this.updateEmployee(employeeWithAvatar)
                   
        },
        error: () => {
          const error: ApiResponse = {
            status: 500,
            message: 'global.error.500'
          }
          this.sendMessage.emit(error)
        }
      })
    }else{
      this.store.dispatch(fromRegisterPageActions.userLoadingFailed())
      this.sendMessage.emit(response)
    }
  }

  updateEmployee(employee: Employee){
    this.employeesService.updateEmployee(employee).subscribe({
      next: (response: ApiResponse) => {
        if(response.status !== 200){
          this.store.dispatch(fromRegisterPageActions.userUpdatingFailed())
          this.sendMessage.emit(response)
        }else{
          const profile: ProfileState = {
            name: employee.name,
            job: employee.job,
            uid: employee.id,
            avatar: employee.avatar,
            language: employee.language
          }
          
          this.initApp.emit(profile)
        }
      },
      error: () => {
        const error: ApiResponse = {
          status: 500,
          message: 'global.error.500'
        }
        this.sendMessage.emit(error)
      }
    }) 
  }
  
}
