/** Angular core */
import { Component } from '@angular/core'

/** Router */
import { Router } from '@angular/router'

/** App imports */
import { Pages } from '@layout/index'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  protected PagesEnum = Pages
  protected menuWidth: number
  protected currentPage: number

  constructor(
    private router: Router
  ){
    this.menuWidth = 20
    this.currentPage = this.PagesEnum.DASHBOARD
  }

  menuOption(selectedOption: number){
    this.currentPage = selectedOption
    switch(selectedOption){
      case this.PagesEnum.DASHBOARD:
        this.router.navigate(['layout/dashboard'])
        break
      case this.PagesEnum.PROJECTS:
        this.router.navigate(['layout/projects'])
        break
      case this.PagesEnum.TASKS:
        this.router.navigate(['layout/tasks'])
        break
      case this.PagesEnum.MESSAGES:
        this.router.navigate(['layout/messages'])
        break
      case this.PagesEnum.ACTIVITY:
        this.router.navigate(['layout/activity'])
        break
      default:
        this.router.navigate(['layout/dashboard'])
        break
    }
  }
}
