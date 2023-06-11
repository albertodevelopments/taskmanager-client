import { Component, Input, OnInit } from '@angular/core';
import { Employee } from '@core/index';

@Component({
  selector: 'app-top-employees',
  templateUrl: './top-employees.component.html',
  styleUrls: ['./top-employees.component.scss']
})
export class TopEmployeesComponent implements OnInit{

  @Input() listOfEmployees: Employee[]

  protected topEmployees: Employee[]

  constructor(){
    this.listOfEmployees = []
    this.topEmployees = []
  }

  ngOnInit(): void {
    this.topEmployees = this.listOfEmployees.sort((a: any,b: any) => b.points - a.points).filter((employee, index) => index <= 4)
  }

}
