/** Angular core */
import { NgModule } from '@angular/core'

/** App imports */
import { AuthenticationRoutingModule, LoginComponent, SignupComponent } from '@modules/authentication'
import { SigninComponent } from '@modules/authentication'
import { SharedModule } from '@shared/index'

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    SigninComponent
  ],
  imports: [
    SharedModule,
    AuthenticationRoutingModule,
  ]
})
export class AuthenticationModule { }
