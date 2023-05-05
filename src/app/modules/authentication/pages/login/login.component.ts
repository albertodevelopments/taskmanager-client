/** Angular core */
import { Component } from '@angular/core'

/** App imports */
import { ApiResponse } from '@core/index'
import { TranslationPipe } from '@shared/index'

/** Librerías */
import { MessageService } from 'primeng/api'

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
  ){
    this.view = 'L'
  }

  showSignin(): void{
    this.view = 'L'
  }

  showRegister(): void{
    this.view = 'R'
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
