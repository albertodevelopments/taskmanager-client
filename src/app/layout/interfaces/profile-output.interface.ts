import { Employee } from "@core/index"

export interface ProfileOutput {
    employee: Employee | null,
    changeLanguage: boolean
}
