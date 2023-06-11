import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-kpi',
  templateUrl: './header-kpi.component.html',
  styleUrls: ['./header-kpi.component.scss']
})
export class HeaderKpiComponent {
  @Input() total: number
  @Input() percentThisMonth: number
  @Input() label: string
  @Input() img: string

  constructor(
  ){
    this.total = 0
    this.percentThisMonth = 0
    this.label = ''
    this.img = ''
  }
}
