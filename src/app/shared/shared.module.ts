/** Angular core */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

/** App imports */
import { SharedRoutingModule } from './shared-routing.module'
import { TranslationPipe } from '@shared/index'

/** Librerías */
import { ToastModule } from 'primeng/toast'
import { DynamicDialogModule } from 'primeng/dynamicdialog'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { CalendarModule } from 'primeng/calendar'
import { ProgressBarModule } from 'primeng/progressbar'
import { NgChartsModule } from 'ng2-charts';
import { LeadingZerosPipe } from './modules/util/pipes/leading-zeros.pipe';
import { ParseTimePipe } from './modules/util/pipes/parse-time.pipe'

@NgModule({
  declarations: [TranslationPipe, LeadingZerosPipe, ParseTimePipe],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastModule        ,
    DynamicDialogModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    CalendarModule,
    ProgressBarModule,
    NgChartsModule
  ],
  exports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslationPipe,
    LeadingZerosPipe,
    ToastModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    CalendarModule,
    ProgressBarModule,
    NgChartsModule
  ]
})
export class SharedModule { }
