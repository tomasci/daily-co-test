import {configureStore} from "@reduxjs/toolkit"
import {setupListeners} from "@reduxjs/toolkit/query"
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"
import PlatformSlice from "@/store/slices/PlatformSlice"
import PlatformPrivateSlice from "@/store/slices/PlatformPrivateSlice"

export function setUpStore() {
	const store = configureStore({
		reducer: {
			PlatformSlice: PlatformSlice,
			PlatformPrivateSlice: PlatformPrivateSlice,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({serializableCheck: false}).concat([]),
	})

	setupListeners(store.dispatch)

	return store
}

export const store = setUpStore()

export type AppStore = ReturnType<typeof setUpStore>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
