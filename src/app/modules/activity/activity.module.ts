import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ActivityRoutingModule, ActivityComponent } from '@modules/activity'

@NgModule({
  declarations: [
    ActivityComponent
  ],
  imports: [
    CommonModule,
    ActivityRoutingModule
  ],
  exports: [
    ActivityComponent
  ]
})
export class ActivityModule { }
