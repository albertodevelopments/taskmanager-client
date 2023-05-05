/** Angular core */
import { ProfileState } from "@core/index"

/** Estado global */
import { createAction, props } from "@ngrx/store"

export const startRegister = createAction('[Register Page] Start Register')

export const registered = createAction(
    '[Register Page] Registered',
    props<{ newToken: string }>()
)

export const registerFailed = createAction('[Register Page] Register Failed')

export const loadingUser = createAction('[Register Page] Loading User')

export const userLoaded = createAction(
    '[Register Page] User Loaded',
    props<{ newProfile: ProfileState }>()
)

export const userLoadingFailed = createAction('[Register Page] User Loading Failed')
