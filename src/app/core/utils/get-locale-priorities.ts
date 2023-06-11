import { priorities } from '@core/index'

export const getLocalePriorities = (language: string) => {
    let localePriorities: any[] = []
    if(language === 'en'){
      localePriorities = priorities.map(priority => {
        return{
            id: priority.id,
            description: priority.descriptionEn
        }
      })
    }
    if(language === 'es'){
      localePriorities = priorities.map(priority => {
        return{
          id: priority.id,
          description: priority.descriptionSp
        }
      })
    }
    return localePriorities
}