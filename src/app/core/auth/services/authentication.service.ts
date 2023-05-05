/** Angular core */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, take } from 'rxjs';

/** App imports */
import { Credentials, Registration } from '@modules/authentication';
import { environment } from '@env/environment'
import { ApiResponse, Employee } from '@core/index';
import { LayoutService } from '@layout/index';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private layoutService: LayoutService
  ) {
  }

  register(registration: Registration): Observable<ApiResponse>{
      const url = `${environment.BASE_URL}/employees`
      const headers = new HttpHeaders().set('Content-type', 'application/json')

      return this.http.post<ApiResponse>(url, registration, {headers})
      .pipe(
        take(1),
        catchError(httpError => {
          if(httpError.status === 404){
            return of({
              "status": httpError.status,
              "message": 'login.error.404'
            })  
          }else{
            const { error } = httpError
            return of({
              'status': error.status,
              'message': error.message
            })
          }
        })
      )
  }

  login(credentials: Credentials): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/auth`
    const headers = new HttpHeaders().set('Content-type', 'application/json')

    const loginRegistration = {
      'email': credentials.email,
      'password': credentials.password
    }

    return this.http.post<ApiResponse>(url, loginRegistration, {headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        console.error(httpError)

        const { error } = httpError
        return of({
          'status': error.status,
          'message': error.message
        })
      })
    )
  }

  getAuthenticatedUser(): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/auth`

    return this.http.get<ApiResponse>(url)
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

  fetchAvatarUrl(employee: Employee): void{
    /** Obtenemos un avatar aleatorio de un API público */
    const url = `${environment.AVATARS_URL}/api/?gender=${employee.genre}`

    this.http.get(url).subscribe((response: any) => {

      const employeeWithAvatar = {
        ...employee,
        avatar: response.results[0].picture.medium
      }

      /** Grabamos el avatar en el registro del empleado */
      this.layoutService.updateEmployee(employeeWithAvatar).subscribe((response: ApiResponse) => {
        console.log(response)
      })
    })
  }

}
