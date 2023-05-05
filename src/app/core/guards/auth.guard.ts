import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { fromAuthSelectors } from '@store/index';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  private isLoggedIn$: Observable<boolean>
  private token: Observable<string>

  constructor(
    private store: Store,
    private router: Router
  ){
    this.isLoggedIn$ = this.store.select(fromAuthSelectors.isLoggedIn)
    this.token = this.store.select(fromAuthSelectors.token)
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.isLoggedIn$.pipe(
        take(1)
      )
      .subscribe({
        next: isLoggedIn => {
          if(!isLoggedIn){
            this.router.navigate(['/login'])
          }
        }  
      })

    return true;
  }
}
