/** Angular core */
import { Component } from '@angular/core'
import { Observable } from 'rxjs'

/** App imports */
import { LoadingService } from '@core/index'

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

  protected isLoading$: Observable<boolean>

  constructor(
    private loadingService: LoadingService
  ){
    this.isLoading$ = this.loadingService.isLoading$
  }

}
