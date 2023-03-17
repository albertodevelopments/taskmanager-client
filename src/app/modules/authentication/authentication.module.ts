import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AuthenticationRoutingModule, LoginComponent, SignupComponent } from '@modules/authentication'


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule
  ]
})
export class AuthenticationModule { }
