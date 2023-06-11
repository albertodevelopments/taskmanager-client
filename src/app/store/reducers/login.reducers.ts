/** Estado global */
import { ActionReducerMap } from '@ngrx/store'

/** App imports */
import { authReducer, profileReducer } from '@store/index'
import { AuthState, ProfileState } from '@core/index'

export interface LoginState {
    authState: AuthState,
    profileState: ProfileState
}

export const loginReducers: ActionReducerMap<LoginState> = {
    authState: authReducer,
    profileState: profileReducer
}
