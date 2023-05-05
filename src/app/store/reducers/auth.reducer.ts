/** Estado global */
import { createReducer, on } from '@ngrx/store'

/** App imports */
import { fromSigninPageActions, fromRegisterPageActions, fromHeaderPageActions } from '@store/index'
import { AuthState } from '@core/index'

export const authStateFeatureKey = 'authState'

export const initialState: AuthState = {
    isLoggedIn: false,
    token: ''
}

export const authReducer = createReducer(
    initialState,
    on(
        fromSigninPageActions.startSignin,
        fromRegisterPageActions.startRegister,
        (currentState: AuthState) => currentState),
    on(
        fromSigninPageActions.signedIn, 
        fromRegisterPageActions.registered,
        (currentState, action ) => {
        const { newToken } = action
        sessionStorage.setItem('taskmanager-token', newToken)
        return{
            ...currentState,
            isLoggedIn: true,
            token: newToken
        }
    }),
    on(
        fromSigninPageActions.signinFailed, 
        fromRegisterPageActions.registerFailed,
        (currentState) => {
        return{
            ...currentState,
            isLoggedIn: false,
            token: ''
        }
    }),
    on(
        fromHeaderPageActions.logout,
        (currentState) => {
            sessionStorage.removeItem('taskmanager-token')
            return{
                ...currentState,
                isLoggedIn: false,
                token: ''
            }
        }
    )
)