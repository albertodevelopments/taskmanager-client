/** Angular core */
import { APP_INITIALIZER, NgModule, isDevMode } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http'

/** Estado global */
import { StoreModule } from '@ngrx/store'
import { loginReducers } from '@store/index'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

/** App imports */
import { SharedModule } from '@shared/index'
import { TranslationService } from './shared'
import { AuthInterceptorService, SpinnerComponent, LoadingInterceptorService } from '@core/index';

/** Incicializamos la aplicación cargando las traducciones. Si devuelve error,
 *  no cargará la página
  */
export function translationFactory(
  translationService: TranslationService,
  ) {
  return async () => {
    await translationService.loadTranslationsSet('en')
  }
}


@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    StoreModule.forRoot(loginReducers),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: translationFactory,
      deps: [TranslationService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true,
   },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
