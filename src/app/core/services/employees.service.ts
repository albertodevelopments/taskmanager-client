/** Angular core */
import { Injectable } from '@angular/core'
import { Observable, catchError, of, take } from 'rxjs';

/** Http */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'

/** App imports */
import { environment } from '@env/environment'
import { ApiResponse, Employee } from '@core/index'

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private _headers: HttpHeaders

  constructor(
    private http: HttpClient
  ) {
    this._headers = new HttpHeaders().set('Content-Type', 'application/json')
   }

  getEmployee(uid: string): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/employees/${uid}`
    

    return this.http.get<ApiResponse>(url, {headers: this._headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        if (error.status){
          return of(error)
        }else{
          if(httpError.status === 404){
            return of({
              'status': httpError.status,
              'message': 'employee.error.404'
            })
          }else{
            return of({
              'status': 500,
              'message': 'employee.error.500'
            })
          }
        }
      })
    )
  }

  getEmployees(): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/employees`

    return this.http.get<ApiResponse>(url, {headers: this._headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        return of(error)
      })
    )
  }
  
  getEmployeesByTeam(teamId: number){
    const url = `${environment.BASE_URL}/employees/team/${teamId}`

    return this.http.get<ApiResponse>(url, {headers: this._headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        return of(error)
      })
    )
  }

  updateEmployee(employee: Employee): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/employees/${employee.id}`
    const headers = new HttpHeaders().set('Content-Type', 'application/json')

    return this.http.put<ApiResponse>(url, employee, {headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        return of(error)
      })
    )
  }
}
