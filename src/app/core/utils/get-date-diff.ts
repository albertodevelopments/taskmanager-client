export const getDatesDifferenceInHours = (dateFrom: Date, dateTo: Date):string => {

  const elapsedTime = dateTo.getTime() - dateFrom.getTime()
  const elapsedTimeInHours = elapsedTime / (1000 * 3600)
    
  const days = Math.floor(elapsedTime / (1000 * 3600 * 24))
  const elapsedHours = Math.floor(elapsedTimeInHours)
  const hours = Math.floor(elapsedHours) - 24 * days
  const minutes = Math.floor((elapsedTimeInHours - elapsedHours) * 60)

  if(days === 0){
    if(hours === 0){
      return `${minutes} min`
    }else{
      return `${hours}h ${minutes} min`
    }
  }else{
    if(minutes === 0){
      if(hours === 0){
        return `${days}d`    
      }else{
        return `${days}d ${hours}h`  
      }
    }else{
      if(hours === 0){
        return `${days}d ${minutes}min`  
      }else{
        return `${days}d ${hours}h ${minutes}min`    
      }
    }
  }

}