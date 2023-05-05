/** Angular core */
import { NgModule } from '@angular/core';

/** App imports */
import { SharedModule } from '@shared/index';
import { SpinnerComponent } from '@core/index';

@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    SharedModule
  ]
})
export class CoreModule { }
