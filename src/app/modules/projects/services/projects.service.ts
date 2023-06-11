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

  private _headers: HttpHeaders

  constructor(
    private http: HttpClient
  ) { 
    this._headers = new HttpHeaders().set('Content-Type', 'application/json')
  }

  saveProject(project: Project): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/projects`    

    return this.http.post<ApiResponse>(url, project, {headers: this._headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        return of(error)
      })
    )
  }

  getProjects(): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/projects`

    return this.http.get<ApiResponse>(url, {headers: this._headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        return of(error)
      })
    )
  }

  getProjectsByTeam(teamId: number): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/projects/team/${teamId}`

    return this.http.get<ApiResponse>(url, {headers: this._headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        return of(error)
      })
    )
  }
}
