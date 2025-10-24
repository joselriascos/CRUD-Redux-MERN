import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './users/slice'
import {
  persistanceLocalStorageMiddleware,
  syncWithDatabase,
} from './middlewares'

export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      persistanceLocalStorageMiddleware,
      syncWithDatabase
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
