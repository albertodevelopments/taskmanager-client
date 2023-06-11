/** Angular core */
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Router } from '@angular/router'

/** App imports */
import { Pages } from '@layout/index'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  @Input() currentPage: number
  @Output() selectMenuOption: EventEmitter<number>

  protected PagesEnum = Pages
  
  constructor(
    private router: Router
  ){
    this.selectMenuOption = new EventEmitter<number>()
    this.currentPage = this.PagesEnum.DASHBOARD
    this.router.navigate(['layout/dashboard'])
  }

  selectOption(option: number): void{
    this.selectMenuOption.emit(option)
  }
}
