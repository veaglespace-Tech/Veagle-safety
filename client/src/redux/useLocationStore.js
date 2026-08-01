// Deprecated Zustand store replaced by Redux Toolkit locationSlice
import { useSelector, useDispatch } from 'react-redux';
import { updateCoordinates, setLocationStatus } from './slices/locationSlice.js';

export const useLocationStore = () => {
  const dispatch = useDispatch();
  const locationState = useSelector((state) => state?.location || {});
  return {
    ...locationState,
    startTracking: () => {},
    updateCoordinates: (coords) => dispatch(updateCoordinates(coords)),
    setLocationStatus: (status) => dispatch(setLocationStatus(status)),
  };
};
