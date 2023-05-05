/** Estado global */
import { createFeatureSelector, createSelector } from "@ngrx/store"

/** App imports */
import { ProfileState } from "@core/index"
import { profileStateFeatureKey } from "@store/reducers/profile.reducer"

const profileState = createFeatureSelector<ProfileState>(profileStateFeatureKey)

export const username = createSelector(
    profileState,
    (profileState) => profileState.name
 )

 export const job = createSelector(
    profileState,
    (profileState) => profileState.job
 )

 export const uid = createSelector(
   profileState,
   (profileState) => profileState.uid
 )

 export const avatar = createSelector(
  profileState,
  (profileState) => profileState.avatar
)