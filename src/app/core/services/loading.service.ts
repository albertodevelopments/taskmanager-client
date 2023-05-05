/** Angular core */
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoading: BehaviorSubject<boolean>
  public isLoading$: Observable<boolean>

  constructor() { 
    this.isLoading = new BehaviorSubject<boolean>(true)
    this.isLoading$ = this.isLoading.asObservable()
  }

  showSpinner(): void{
    this.isLoading.next(true)
  }

  hideSpinner(): void{
    this.isLoading.next(false)
  }
}
