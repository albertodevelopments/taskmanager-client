import { teams } from "@core/index"

export const findTeam = (teamId: number) => {
    const team: any = teams.filter(team => team.id === teamId)
    return team[0]
}