/** Angular core */
import { Component } from '@angular/core'
import { Router } from '@angular/router'

/** App imports */
import { ApiResponse, ProfileState } from '@core/index'
import { Store } from '@ngrx/store'
import { TranslationPipe, TranslationService } from '@shared/index'
import { CalendarTranslationService } from '@shared/modules/translatation/services/calendar-translation.service'
import { fromRegisterPageActions, fromSigninPageActions } from '@store/index'

/** Librerías */
import { MessageService, PrimeNGConfig } from 'primeng/api'
import { take } from 'rxjs'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService, TranslationPipe]
})
export class LoginComponent {

  protected view: string

  constructor(
    private translationPipe: TranslationPipe,
    private messageService: MessageService,
    private translationService: TranslationService,
    private store: Store,
    private router: Router,
    private calendarTranslationService: CalendarTranslationService,
    private primengConfig: PrimeNGConfig
  ){
    this.view = 'L'
  }

  showSignin(): void{
    this.view = 'L'
  }

  showRegister(): void{
    this.view = 'R'
  }

  async initApp(profile: ProfileState){
    await this.translationService.loadTranslationsSet(profile.language)

    if(this.view === 'L'){
      this.store.dispatch(fromSigninPageActions.userLoaded({newProfile: profile}))
    }else{
      this.store.dispatch(fromRegisterPageActions.userUpdated({newProfile: profile}))
    }
    this.router.navigate(['layout'])

    /** Cargamos las traducciones del calendario */
    this.calendarTranslationService.changeLanguage(profile.language)
    this.calendarTranslationService.translate().pipe(take(1)).subscribe(data => {      
      this.primengConfig.setTranslation(data);
    })
  }

  showRegisterNotification(apiResponse: ApiResponse): void{
    const translatedMessage = this.translationPipe.transform(apiResponse.message)
    const messageError = this.translationPipe.transform('register.error.header')

    this.messageService.add({ severity: 'error', summary: messageError, detail: translatedMessage })
  }  

  showSignInNotification(apiResponse: ApiResponse): void{
    const translatedMessage = this.translationPipe.transform(apiResponse.message)
    const messageError = this.translationPipe.transform('signin.error.header')

    this.messageService.add({ severity: 'error', summary: messageError, detail: translatedMessage })
  }  
}
