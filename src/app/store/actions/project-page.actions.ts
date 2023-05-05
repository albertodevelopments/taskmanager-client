import { createAction } from "@ngrx/store";

export const creatingProject = createAction('[Project Page] Creating Project')

export const projectCreated = createAction('[Project Page] Project Created')

export const projectCreatingFailed = createAction('[Project Page] Project Creating Failed')