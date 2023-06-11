export const getDateFormat = (language: string) => {
    switch(language){
        case 'en':
            return 'mm/dd/yy'
        case 'es':
            return 'dd/mm/yy'
        default:
            return 'mm/dd/yy'
    }
}