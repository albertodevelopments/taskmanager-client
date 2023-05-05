/** Angular */
import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    const token:string | null = sessionStorage.getItem('taskmanager-token')
    const authorization = `Bearer ${token}`

    let httpRequest: HttpRequest<any> = req 

    if(token){
      httpRequest = req.clone({
        setHeaders: {
          'Content-type': 'application/json',
          authorization
        }
      })
    }

    return next.handle(httpRequest)
  }
}
