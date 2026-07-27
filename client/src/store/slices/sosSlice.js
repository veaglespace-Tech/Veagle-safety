import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const startEmergencySos = createAsyncThunk('sos/startEmergencySos', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/sos/start', payload);
    return res.data.sosSession;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to activate Emergency SOS');
  }
});

export const resolveEmergencySos = createAsyncThunk('sos/resolveEmergencySos', async (sosSessionId, { rejectWithValue }) => {
  try {
    const res = await api.post('/sos/resolve', { sosSessionId });
    return res.data.session;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to resolve Emergency SOS');
  }
});

export const checkActiveSos = createAsyncThunk('sos/checkActiveSos', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/sos/active');
    return res.data.session;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch active session');
  }
});

const sosSlice = createSlice({
  name: 'sos',
  initialState: {
    activeSession: null,
    isTriggering: false,
    error: null,
  },
  reducers: {
    clearSosState: (state) => {
      state.activeSession = null;
      state.isTriggering = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startEmergencySos.pending, (state) => {
        state.isTriggering = true;
      })
      .addCase(startEmergencySos.fulfilled, (state, action) => {
        state.isTriggering = false;
        state.activeSession = action.payload;
      })
      .addCase(startEmergencySos.rejected, (state, action) => {
        state.isTriggering = false;
        state.error = action.payload;
      })

      .addCase(resolveEmergencySos.fulfilled, (state) => {
        state.activeSession = null;
      })

      .addCase(checkActiveSos.fulfilled, (state, action) => {
        state.activeSession = action.payload;
      });
  },
});

export const { clearSosState } = sosSlice.actions;
export default sosSlice.reducer;
