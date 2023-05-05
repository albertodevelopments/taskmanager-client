/** Angular */
import { Component, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

/** App imports */
import { AuthenticationService, ApiResponse, Employee, ProfileState } from '@core/index'
import { Credentials, passwordsMustMatchValidator } from '@modules/authentication'
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

  protected registerForm: FormGroup
  public notificationMessage: ApiResponse

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private store: Store
  ){
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      job: new FormControl('', [Validators.required]),
      genre: new FormControl('', [Validators.required]),
      language: new FormControl('', [Validators.required])
    }, {validators: passwordsMustMatchValidator})

    this.sendMessage = new EventEmitter<ApiResponse>()
    this.notificationMessage = {
      status: 0,
      message: ''
    }
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

  register(): void{
    this.store.dispatch(fromRegisterPageActions.startRegister())
    this.registerForm.markAsPending()
    const registration: Registration = {
      'name': this.name.value,
      'email': this.email.value,
      'password': this.password.value,
      'job': this.job.value,
      'genre': this.genre.value,
      'language': this.language.value
    }
    this.authenticationService.register(registration).subscribe((response: ApiResponse) => {
      if(response.status === 200){
        /** Guardamos el token de autenticación en el store */
        const token = response.message
        this.store.dispatch(fromRegisterPageActions.registered({ newToken: token }))
        this.authenticate()        
      }else{
        this.sendMessage.emit(response)
      }
    })
  }

  authenticate(): void{
    this.store.dispatch(fromRegisterPageActions.loadingUser())

    this.authenticationService.getAuthenticatedUser().subscribe((response: ApiResponse) => {
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
          language: backendEmployee.language
        }

        const profile: ProfileState = {
          name: employee.name,
          job: employee.job,
          uid: employee.id,
          avatar: employee.avatar
        }

        this.store.dispatch(fromRegisterPageActions.userLoaded({ newProfile: profile }))
        this.authenticationService.fetchAvatarUrl(employee)
        this.router.navigate(['layout'])
      }else{
        this.store.dispatch(fromRegisterPageActions.userLoadingFailed())
        this.sendMessage.emit(response)
      }
    })    
  } 
}
