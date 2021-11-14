import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MapState } from 'react-yandex-maps'
import { Coordinates } from '../App'
import { CarData } from '../mockData'

interface AppState {
  error: boolean;
  carData: CarData[] | null;
  currentCoordinates: Coordinates | null;
  address: string;
  mapState: MapState;
  loading: boolean;
}

const initialState: AppState = {
  error: true,
  carData: null,
  currentCoordinates: null,
  address: '',
  mapState: { center: [54.72650424851578, 55.94512581929156], zoom: 12 },
  loading: false
}

export const appSlice = createSlice({
  name: 'App',
  initialState,
  reducers: {
    setError: (state, {payload}: PayloadAction<boolean>) => {
      state.error = payload
    },
    setCarData: (state, {payload}: PayloadAction<CarData[] | null>) => {
      state.carData = payload
    },
    setCurrentCoordinates: (state, {payload}: PayloadAction<Coordinates | null>) => {
      state.currentCoordinates = payload
      state.mapState.center = payload ?? undefined
    },
    setAddress: (state, {payload}: PayloadAction<string>) => {
      state.address = payload
    },
    handleError: (state) => {
      state.carData = null
      state.currentCoordinates = null
      state.error = true
      state.loading = false
    },
    setLoading: (state, {payload}: PayloadAction<boolean>) => {
      state.loading = payload
    }
  }
})

export const {setError, setCarData, setCurrentCoordinates, setAddress, handleError, setLoading} = appSlice.actions

export default appSlice.reducer