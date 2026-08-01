// Deprecated Zustand store replaced by Redux Toolkit authSlice
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, logout } from './slices/authSlice.js';

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state?.auth || {});
  return {
    ...authState,
    fetchUser: () => dispatch(fetchUser()),
    logout: () => dispatch(logout()),
  };
};
