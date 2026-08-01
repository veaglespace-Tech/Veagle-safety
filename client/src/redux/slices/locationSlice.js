import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'LIVE', // 'LIVE', 'STALE', 'DENIED', 'OFFLINE'
  latitude: 18.5204,
  longitude: 73.8567,
  accuracy: 10,
  lastUpdated: null,
  isTracking: false,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocationStatus: (state, action) => {
      state.status = action.payload;
    },
    updateCoordinates: (state, action) => {
      const { latitude, longitude, accuracy } = action.payload;
      state.latitude = latitude;
      state.longitude = longitude;
      if (accuracy) state.accuracy = accuracy;
      state.lastUpdated = Date.now();
      state.status = 'LIVE';
    },
    setTrackingState: (state, action) => {
      state.isTracking = action.payload;
    },
  },
});

export const { setLocationStatus, updateCoordinates, setTrackingState } = locationSlice.actions;
export default locationSlice.reducer;
