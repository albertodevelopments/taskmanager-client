/** Angular */
import { Component, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

/** App imports */
import { AuthenticationService, ApiResponse, Employee, ProfileState } from '@core/index'
import { Credentials } from '@modules/authentication/interfaces/credentials.interface'

/** Estado global */
import { Store } from '@ngrx/store'
import { fromSigninPageActions } from '@store/index'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  @Output() sendMessage: EventEmitter<ApiResponse>
  @Output() initApp: EventEmitter<ProfileState>

  protected signInForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private store: Store
  ){
    this.signInForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
    this.sendMessage = new EventEmitter<ApiResponse>()    
    this.initApp = new EventEmitter<ProfileState>()
  }

  get email(): FormControl{
    return this.signInForm.get('email') as FormControl
  }

  get password(): FormControl{
    return this.signInForm.get('password') as FormControl
  }

  login(){
    this.store.dispatch(fromSigninPageActions.startSignin())
    this.signInForm.markAsPending()
    const credentials: Credentials = {
      'name': '',
      'email': this.email.value,
      'password': this.password.value
    }

    this.authenticationService.login(credentials).subscribe({
      next: (response: ApiResponse) => {
        if(response.status === 200){
          /** Guardamos el token de autenticación en el store */
          const token = response.message
          this.store.dispatch(fromSigninPageActions.signedIn({ newToken: token }))
          this.authenticate()
        }else{
          this.store.dispatch(fromSigninPageActions.signinFailed())
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
    this.store.dispatch(fromSigninPageActions.loadingUser())

    this.authenticationService.getAuthenticatedUser().subscribe({
      next: (response: ApiResponse) => {
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
  
          /** Asignamos el idioma de la aplicación y la inicializamos */
          this.initApp.emit(profile)
          
        }else{
          this.store.dispatch(fromSigninPageActions.userLoadingFailed())
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
}
