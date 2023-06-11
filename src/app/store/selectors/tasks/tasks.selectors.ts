/** Estado global */
import { Status, TasksState } from "@core/index"
import { TaskInterface } from "@modules/tasks"
import { createFeatureSelector, createSelector } from "@ngrx/store"
import { tasksStateFeatureKey } from "@store/reducers/tasks.reducer"

const tasksState = createFeatureSelector<TasksState>(tasksStateFeatureKey)

export const tasks = createSelector(
    tasksState,
    (tasksState) => tasksState.tasks
)

export const pendingTasks = createSelector(
    tasksState,
    (tasksState) => tasksState.tasks.filter((task: TaskInterface) => task.status === Status.TODO)
)

export const inProgressTasks = createSelector(
    tasksState,
    (tasksState) => tasksState.tasks.filter((task: TaskInterface) => task.status === Status.IN_PROGRESS)
)

export const inReviewTasks = createSelector(
    tasksState,
    (tasksState) => tasksState.tasks.filter((task: TaskInterface) => task.status === Status.REVIEW)
)
