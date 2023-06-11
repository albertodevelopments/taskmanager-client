/** Estado global */
import { createAction, props } from "@ngrx/store"

/** App imports */
import { TaskInterface } from "@modules/tasks"

export const addingTask = createAction('[Task Page] Adding Task')

export const taskAdded = createAction(
    '[Task Page] Task added',
    props<{ currentTask: TaskInterface }>()
)

export const addingTaskFailed = createAction('[Task Page] Adding Task Failed')