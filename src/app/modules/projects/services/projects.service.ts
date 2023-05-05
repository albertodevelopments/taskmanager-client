/** Angular core */
import { Injectable } from '@angular/core'
import { Observable, catchError, of, take } from 'rxjs'

/** Http */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'

/** App imports */
import { environment } from '@env/environment'
import { Project } from '@modules/projects'
import { ApiResponse } from '@core/index'

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private http: HttpClient
  ) { }

  saveProject(project: Project): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/projects`
    const headers = new HttpHeaders().set('Content-Type', 'application/json')

    return this.http.post<ApiResponse>(url, project, {headers})
    .pipe(
      take(1),
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
