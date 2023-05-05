/** Angular core */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { Observable, catchError, map, of, take } from 'rxjs'

/** App imports */
import { ApiResponse, Employee } from '@core/index'

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  
  constructor(
    private http: HttpClient,
  ) {
  }

  getEmployee(uid: string): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/employees/${uid}`
    const headers = new HttpHeaders().set('Content-Type', 'application/json')

    return this.http.get<ApiResponse>(url, {headers})
    .pipe(
      take(1),
      map((response: ApiResponse) => {
        return {
          'status': response.status,
          'message': response.message
        }
      }),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        console.error(error.status)
        if (error.status){
          return of({
            'status': error.status,
            'message': error.message
          })
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

  updateEmployee(employee: Employee): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/employees/${employee.id}`
    const headers = new HttpHeaders().set('Content-Type', 'application/json')

    return this.http.put<ApiResponse>(url, employee, {headers})
    .pipe(
      take(1),
      map((response: ApiResponse) => {
        return {
          'status': response.status,
          'message': response.message
        }
      }),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        return of({
          'status': error.status,
          'message': error.message
        })
      })
    )
  }
}
