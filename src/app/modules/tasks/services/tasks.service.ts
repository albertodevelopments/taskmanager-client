/** Angular core */
import { Injectable } from '@angular/core'
import { Observable, catchError, forkJoin, of, pipe, take } from 'rxjs'

/** Http */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'

/** App imports */
import { ApiResponse } from '@core/index'
import { environment } from '@env/environment'
import { TaskInterface } from '../interfaces/task.interface'

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private _headers

  constructor(
    private http: HttpClient
  ) {
    this._headers = new HttpHeaders().set('Content-Type', 'application/json')
  }

  saveTask(task: TaskInterface): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/tasks`

    return this.http.post<ApiResponse>(url, task, {headers: this._headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        console.log(error)
        return of(error)
      })
    )
  }

  getTasks(): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/tasks`

    return this.http.get<ApiResponse>(url, {headers: this._headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        console.log(error)
        return of(error)
      })
    )
  }

  getTasksWithEmployeeData(): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/tasks/employee`

    return this.http.get<ApiResponse>(url, {headers: this._headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        return of(error)
      })
    )
  }

  updateTask(task: TaskInterface): Observable<ApiResponse>{
    const url = `${environment.BASE_URL}/tasks/${task.id}`

    console.log(task)

    return this.http.put<ApiResponse>(url, task, {headers: this._headers})
    .pipe(
      take(1),
      catchError((httpError: HttpErrorResponse) => {
        const {error} = httpError
        return of(error)
      })
    )
  }
}
