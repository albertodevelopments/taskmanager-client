import { teams } from '@core/index'

export const getLocalTeams = (language: string) => {
    let localeTeams: any[] = []
    if(language === 'en'){
      localeTeams = teams.map(team => {
        return{
            id: team.id,
            name: team.nameEn
        }
      })
    }
    if(language === 'es'){
      localeTeams = teams.map(team => {
        return{
          id: team.id,
          name: team.nameSp
        }
      })
    }
    return localeTeams
}