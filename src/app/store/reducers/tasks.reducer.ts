/** Estado global */
import { ActionReducerMap, createReducer, on } from "@ngrx/store"
import { fromTaskPageActions, fromTasksPageActions } from ".."

/** App imports */
import { TasksState } from "@core/index"

export const tasksStateFeatureKey = 'tasksState'

const initialState: TasksState = {
    tasks: [],
    currentTask: null
}

export const tasksReducer = createReducer(
    initialState,
    on(
        fromTasksPageActions.loadingTasks,
        fromTasksPageActions.tasksLoadingFailed,
        fromTasksPageActions.completingTask,
        fromTasksPageActions.taskCompletingFailed,
        (currentState: TasksState) => currentState),
    on(fromTasksPageActions.tasksLoaded,
        (currentState: TasksState, action) => {
            return{
                ...currentState,
                tasks: action.newTasksState.tasks
            }
        }
    ),
    on(
        fromTaskPageActions.addingTask,
        fromTaskPageActions.addingTaskFailed,
        (currentState: TasksState) => currentState),
    on(
        fromTaskPageActions.taskAdded,
        (currentState: TasksState, action) => {
            return{
                ...currentState,
                tasks: [...currentState.tasks, action.currentTask]
            }
        }
    ),
    on(
        fromTasksPageActions.completeTask,
        (currentState: TasksState, action) => {
            return{
                ...currentState,
                tasks: currentState.tasks.map(task => {
                    return{
                        ...task,
                        completed: task.id === action.currentTask.id ? !task.completed : task.completed
                    }
                })
            }
        }
    )
)
