/** Angular core */
import { Component } from '@angular/core'
import { Observable, Subject, take } from 'rxjs'

/** Estado global */
import { Store } from '@ngrx/store'
import { fromHeaderPageActions, fromProfilePageActions, fromProfileSelectors, fromProjectPageActions, fromSigninPageActions } from '@store/index'

/** App imports */
import { TranslationPipe, TranslationService } from '@shared/index'
import { ApiResponse, Employee, ProfileState } from '@core/index'
import { LayoutService } from '@layout/index'
import { Project, ProjectsService } from '@modules/projects'

/** Librerías */
import { MessageService } from 'primeng/api'
import { Router } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [MessageService, TranslationPipe]
})
export class HeaderComponent {

  protected username$: Observable<string>
  protected job$: Observable<string>
  protected avatar$: Observable<string>
  private uid$: Observable<string>
  protected currentEmployee: Employee | null
  protected profileWindowOpen: boolean
  protected projectWindowOpen: boolean
  protected showMenu: boolean
  /** Para lanzar un evento de cierre en la pantalla hija Profile */
  private _closingProfileWindow: Subject<void>
  protected closingProfileWindow$: Observable<void>

  /** Para lanzar un evento de cierre en la pantalla hija Proyecto */
  private _closingProjectWindow: Subject<void>
  protected closingProjectWindow$: Observable<void>
  
  constructor(
    private store: Store,
    private messageService: MessageService,
    private translationPipe: TranslationPipe,
    private layoutService: LayoutService,
    private router: Router,
    private translationService: TranslationService,
    private projectsService: ProjectsService
  ){
    this.username$ = this.store.select(fromProfileSelectors.username)
    this.job$ = this.store.select(fromProfileSelectors.job)
    this.avatar$ = this.store.select(fromProfileSelectors.avatar)
    this.profileWindowOpen = false
    this.projectWindowOpen = false
    this.uid$ = this.store.select(fromProfileSelectors.uid)
    this.currentEmployee = null
    this.showMenu = false
    this._closingProfileWindow = new Subject
    this.closingProfileWindow$ = this._closingProfileWindow.asObservable()
    this._closingProjectWindow = new Subject
    this.closingProjectWindow$ = this._closingProjectWindow.asObservable()
  }

  toggleShowMenu(): void{
    this.showMenu = !this.showMenu
  }

  fetchEmployeeData(): void{
    this.uid$
    .pipe(take(1))
    .subscribe(uid => {
      this.loadEmployee(uid)
    })
  }

  loadEmployee(uid: string): void {
    this.store.dispatch(fromProfilePageActions.loadingUser())
    this.layoutService.getEmployee(uid).subscribe((response: ApiResponse) => {
      if(response.status === 200){
        const backendEmployee: any = response.message
        this.currentEmployee = {
          id: backendEmployee._id,
          name: backendEmployee.name,
          email: backendEmployee.email,
          avatar: backendEmployee.avatar,
          genre: backendEmployee.genre,
          job: backendEmployee.job,
          points: 0,
          rol: backendEmployee.job,
          contacts: [],
          language: backendEmployee.language
        }
        const profile: ProfileState = {
          name: this.currentEmployee.name,
          job: this.currentEmployee.job,
          uid: this.currentEmployee.id,
          avatar: this.currentEmployee.avatar
        }

        this.profileWindowOpen = true
        this.store.dispatch(fromSigninPageActions.userLoaded({newProfile: profile}))
      }else{
        this.showProfileError(response)
        this.store.dispatch(fromSigninPageActions.userLoadingFailed())
      }
    })
  }

  closeProfileWindow(): void{
    this.profileWindowOpen = false
  }

  openProfileWindow(): void{
    this.toggleShowMenu()
    this.fetchEmployeeData()
  }

  openProjectWindow(): void{
    this.projectWindowOpen = true
  }

  closeProjectWindow(): void{
    this.projectWindowOpen = false
  }

  saveEmployee(employee: Employee | null): void{
    this.store.dispatch(fromProfilePageActions.updatingUser())

    if(employee === null) {
      const error: ApiResponse = {
        status: 500,
        message: 'employee.unknown.error.retrieving.profile'
      }
      this.showProfileError(error)
      this.store.dispatch(fromProfilePageActions.userUpdatingFailed())
      return
    }

    this.layoutService.updateEmployee(employee).subscribe((response: ApiResponse) => {
      if(response.status !== 200){
        this.showProfileError(response)
      }else{
        const profile: ProfileState = {
          name: employee.name,
          job: employee.job,
          uid: employee.id,
          avatar: employee.avatar
        }
        this.store.dispatch(fromProfilePageActions.userUpdated({newProfile: profile}))
        /** Todo correcto, cerramos la ventana */
        this._closingProfileWindow.next()
      }
    })
  }

  async changeLanguageAndSave(newEmployee: Employee | null): Promise<any>{

    if(newEmployee === null) return

    try{
      await this.translationService.loadTranslationsSet(newEmployee.language)

      this.layoutService.updateEmployee(newEmployee).subscribe((response: ApiResponse) => {
        if(response.status !== 200){
          this.showProfileError(response)
        }
      })
      this.router.navigate(['login'])
    }catch(error){
      const apiResponse: ApiResponse = {
        'status': 500,
        'message': 'global.get.translation.error'
      }
      this.showProfileError(apiResponse)
      console.error(error)
    }
  }

  saveProject(project: Project): void{
    this.store.dispatch(fromProjectPageActions.creatingProject())
    this.projectsService.saveProject(project).subscribe(response => {
      if(response.status !== 200){
        this.showProjectError(response)
        this.store.dispatch(fromProjectPageActions.projectCreatingFailed())
      }else{
        this.showProjectSuccess(response)
        this._closingProjectWindow.next()
        this.store.dispatch(fromProjectPageActions.projectCreated())
      }
    })
  }

  logout(): void{
    this.store.dispatch(fromHeaderPageActions.logout())
    this.router.navigate(['/login'])
  }

  showProfileError(apiResponse: ApiResponse): void{
    const translatedMessage = this.translationPipe.transform(apiResponse.message)
    const headerMessage = this.translationPipe.transform('employee.error.header')

    this.messageService.add({ severity: 'error', summary: headerMessage, detail: translatedMessage })
  } 

  showProjectError(apiResponse: ApiResponse): void{
    const translatedMessage = this.translationPipe.transform(apiResponse.message)
    const headerMessage = this.translationPipe.transform('project.error.header')

    this.messageService.add({ severity: 'error', summary: headerMessage, detail: translatedMessage })
  } 

  showProjectSuccess(apiResponse: ApiResponse): void{
    const translatedMessage = this.translationPipe.transform(apiResponse.message)
    const headerMessage = this.translationPipe.transform('project.success.header')

    this.messageService.add({ severity: 'success', summary: headerMessage, detail: translatedMessage })
  }
}
