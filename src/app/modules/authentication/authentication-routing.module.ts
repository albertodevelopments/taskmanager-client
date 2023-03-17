/** Angular core */
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

/** App imports */
import { LoginComponent, SignupComponent } from '@modules/authentication'

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
