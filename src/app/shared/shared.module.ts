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

@NgModule({
  declarations: [TranslationPipe],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastModule        ,
    DynamicDialogModule,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ],
  exports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslationPipe,
    ToastModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ]
})
export class SharedModule { }
