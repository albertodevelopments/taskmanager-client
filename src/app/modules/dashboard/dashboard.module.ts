/** Angular core */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

/** App imports */
import { DashboardRoutingModule, DashboardComponent } from '@modules/dashboard'
import { SharedModule } from '@shared/index'

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
