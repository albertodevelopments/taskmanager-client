import { Injectable } from '@angular/core';
import { Employee } from '@core/index';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  private _employee: BehaviorSubject<Employee | null>
  public employee$: Observable<Employee | null>

  constructor() {
    this._employee = new BehaviorSubject<Employee | null>(null)
    this.employee$ = this._employee.asObservable()
   }

   storeEmployee(employee: Employee){
      this._employee.next(employee)
   }

   getEmployee(): Observable<Employee | null>{
    return this.employee$
   }
}
