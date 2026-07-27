import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

const initialToken = localStorage.getItem('tichi_token') || null;

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data.user;
  } catch (err) {
    localStorage.removeItem('tichi_token');
    return rejectWithValue(err.response?.data?.error || 'Session expired');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('tichi_token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue({
      error: err.response?.data?.error || 'Login failed',
      requiresVerification: err.response?.data?.requiresVerification || false,
      email: err.response?.data?.email || email,
    });
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Registration failed');
  }
});

export const verifyEmailOtp = createAsyncThunk('auth/verifyEmailOtp', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/verify-email', { email, otp });
    localStorage.setItem('tichi_token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Verification failed');
  }
});

export const resendOtpCode = createAsyncThunk('auth/resendOtpCode', async (email, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/resend-otp', { email });
    return res.data.message;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to resend OTP');
  }
});

export const updateProfileSettings = createAsyncThunk('auth/updateProfileSettings', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.put('/auth/settings', formData);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    user: null,
    isLoading: false,
    error: null,
    successMessage: null,
    pendingVerificationEmail: null,
    showOtpModal: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('tichi_token');
      state.token = null;
      state.user = null;
      state.error = null;
      state.pendingVerificationEmail = null;
      state.showOtpModal = false;
    },
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setShowOtpModal: (state, action) => {
      state.showOtpModal = action.payload;
    },
    setPendingEmail: (state, action) => {
      state.pendingVerificationEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.token = null;
        state.user = null;
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload?.requiresVerification) {
          state.pendingVerificationEmail = action.payload.email;
          state.showOtpModal = true;
          state.error = 'Email is not verified. Please enter the 6-digit OTP code.';
        } else {
          state.error = typeof action.payload === 'string' ? action.payload : action.payload?.error || 'Login failed';
        }
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        state.pendingVerificationEmail = action.meta.arg.email;
        state.showOtpModal = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // verifyEmailOtp
      .addCase(verifyEmailOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.showOtpModal = false;
        state.pendingVerificationEmail = null;
      })
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // resendOtpCode
      .addCase(resendOtpCode.fulfilled, (state, action) => {
        state.successMessage = action.payload;
      })
      .addCase(resendOtpCode.rejected, (state, action) => {
        state.error = action.payload;
      })

      // updateProfileSettings
      .addCase(updateProfileSettings.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      });
  },
});

export const { logout, clearAuthMessages, setShowOtpModal, setPendingEmail } = authSlice.actions;
export default authSlice.reducer;
