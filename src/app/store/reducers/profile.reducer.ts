/** Estado global */
import { createReducer, on } from '@ngrx/store'

/** App imports */
import { fromSigninPageActions, fromRegisterPageActions, fromProfilePageActions } from '@store/index'
import { ProfileState } from '@core/index'

export const profileStateFeatureKey = 'profileState'

const initialState: ProfileState = {
    name: '',
    job: '',
    uid: '',
    avatar: ''
}

export const profileReducer = createReducer(
    initialState,
    on(
       fromSigninPageActions.loadingUser, 
       fromRegisterPageActions.loadingUser, 
       fromProfilePageActions.loadingUser,
       fromProfilePageActions.userLoadingFailed,
       fromProfilePageActions.updatingUser,
       fromProfilePageActions.userUpdatingFailed,
        (currentState: ProfileState) => currentState),
    on(
        fromProfilePageActions.userLoaded,
        fromSigninPageActions.userLoaded,
        fromRegisterPageActions.userLoaded,
        fromProfilePageActions.userUpdated,
        (currentState: ProfileState, action) => {
            return{
                ...currentState,
                name: action.newProfile.name,
                job: action.newProfile.job,
                uid: action.newProfile.uid,
                avatar: action.newProfile.avatar
            }
        }
    ),
)