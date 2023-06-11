/** Angular core */
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

/** App imports */
import { DashboardComponent } from '@modules/dashboard'

const routes: Routes = [
  {path: '', component: DashboardComponent},  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
