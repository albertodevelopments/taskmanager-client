/** Angular core */
import { ProfileState } from "@core/index"

/** Estado global */
import { createAction, props } from "@ngrx/store"

export const startSignin = createAction('[Signin Page] Start Signin')

export const signedIn = createAction(
    '[Signin Page] Signed In',
    props<{ newToken: string }>()
)

export const signinFailed = createAction('[Signin Page] Signin Failed')

export const loadingUser = createAction('[Signin Page] Loading User')

export const userLoaded = createAction(
    '[Signin Page] User Loaded',
    props<{ newProfile: ProfileState }>()
)

export const userLoadingFailed = createAction('[Signin Page] User Loading Failed')

