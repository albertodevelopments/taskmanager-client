/** Angular */
import { ProfileState } from "@core/index"
import { createAction, props } from "@ngrx/store"

export const loadingUser = createAction('[Profile Page] Loading User')

export const userLoaded = createAction(
    '[Profile Page] User Loaded',
    props<{ newProfile: ProfileState }>()
)

export const userLoadingFailed = createAction('[Profile Page] User Loading Failed')

export const updatingUser = createAction('[Profile Page] Updating User')

export const userUpdated = createAction(
    '[Profile Page] User Updated',
    props<{ newProfile: ProfileState}>()
)

export const userUpdatingFailed = createAction('[Profile Page] User Updating Failed')