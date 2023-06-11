import { TaskInterface } from "@modules/tasks"

export interface TasksState {
    tasks: TaskInterface[],
    currentTask: TaskInterface | null
}