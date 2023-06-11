/** Angular core */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

/** App imports */
import { DashboardRoutingModule, DashboardComponent } from '@modules/dashboard'
import { SharedModule } from '@shared/index'
import { EmployeesTeamKpiComponent, TopEmployeesComponent, HeaderKpiComponent, TasksVsChartComponent,
         TasksStatusChartComponent, TasksVsChartMonthsComponent, TaskCountChartComponent } from '@modules/dashboard'

@NgModule({
  declarations: [DashboardComponent, EmployeesTeamKpiComponent, TopEmployeesComponent, HeaderKpiComponent, TasksVsChartComponent, TasksStatusChartComponent, TasksVsChartMonthsComponent, TaskCountChartComponent],
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
