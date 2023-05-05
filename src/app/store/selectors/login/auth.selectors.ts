/** Estado global */
import { createFeatureSelector, createSelector } from "@ngrx/store"

/** App imports */
import { AuthState } from "@core/index"
import { authStateFeatureKey } from "@store/reducers/auth.reducer"

const authState = createFeatureSelector<AuthState>(authStateFeatureKey)

export const token = createSelector(
   authState,
   (authState) => authState.token as string
)

export const isLoggedIn = createSelector(
   authState,
   (authState) => authState.isLoggedIn as boolean
)
