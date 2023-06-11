/** Angular core */
import { Component } from '@angular/core'

/** App imports */
import { ApiResponse, Status } from '@core/index'
import { TranslationPipe } from '@shared/index'

/** Librerías */
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  providers: [MessageService, TranslationPipe]
})
export class ProjectsComponent {

  protected todo: number
  protected inProgress: number
  protected review: number
  protected done: number

  constructor(
    private translationPipe: TranslationPipe,
    private messageService: MessageService
  ){
    this.todo = Status.TODO
    this.inProgress = Status.IN_PROGRESS
    this.review = Status.REVIEW
    this.done = Status.DONE
  }

  showProjectError(apiResponse: ApiResponse): void{
    const translatedMessage = this.translationPipe.transform(apiResponse.message)
    const headerMessage = this.translationPipe.transform('project.error.header')

    this.messageService.add({ severity: 'error', summary: headerMessage, detail: translatedMessage })
  }

}
