/** Estado global */
import { createAction, props } from "@ngrx/store"

/** App imports */
import { TasksState } from "@core/index"
import { TaskInterface } from "@modules/tasks"

export const loadingTasks = createAction('[Tasks Page] Loading Tasks')

export const tasksLoaded = createAction(
    '[Tasks Page] Tasks Loaded',
    props<{ newTasksState: TasksState }>()
)

export const tasksLoadingFailed = createAction('[Tasks Page] Tasks Loading Failed')

export const completingTask = createAction('[Tasks Page] Completing Task')

export const completeTask = createAction(
    '[Tasks Page] Complete Task',
    props<{ currentTask: TaskInterface }>()
)

export const taskCompletingFailed = createAction('[Tasks Page] Task Completing Failed')