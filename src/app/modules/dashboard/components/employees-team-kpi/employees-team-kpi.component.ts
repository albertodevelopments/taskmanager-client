import { Component, Input, OnInit } from '@angular/core';
import { findTeam } from '@core/utils/find-team';
import { Store } from '@ngrx/store';
import { fromProfileSelectors } from '@store/index';

@Component({
  selector: 'app-employees-team-kpi',
  templateUrl: './employees-team-kpi.component.html',
  styleUrls: ['./employees-team-kpi.component.scss']
})
export class EmployeesTeamKpiComponent implements OnInit{

  @Input() employeesTeamArray: number[]

  protected teamsArray: any[]

  constructor(
    private store: Store
  ){
    this.employeesTeamArray = []
    this.teamsArray = []
  }

  ngOnInit(): void {

    this.store.select(fromProfileSelectors.language).subscribe(lang => this.buildKpis(lang))
  }

  buildKpis(language: string): void{
    /** Calculamos el total de empleados */
    let totalEmployees = 0

    this.employeesTeamArray.forEach(totalTeam => {
      totalEmployees += totalTeam
    })

    if(totalEmployees === 0) return

    /** Creamos un array con los totales obtenidos del componente padre
     *  y los nombres de los departamentos
     */
    this.teamsArray = this.employeesTeamArray.map((totalTeam, index) => {
      const team = findTeam(index + 1)
      let name = ''
      switch(language){
        case 'en':
          name = team.nameEn
          break
        case 'es':
          name = team.nameSp
          break
        default:
          name = team.nameEn
          break
      }
      return{
        name,
        total: totalTeam,
        progress: Math.round(totalTeam * 100 / totalEmployees)
      }
    })
  }
}
