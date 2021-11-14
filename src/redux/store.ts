import { configureStore } from '@reduxjs/toolkit'
import appSliceReducer from './appSlice'

export const store = configureStore({
  reducer: {
    appSliceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch