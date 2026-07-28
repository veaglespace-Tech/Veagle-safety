import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi.js';

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('tichi_token') : null;

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const data = await authApi.getProfile();
    return data.user;
  } catch (err) {
    localStorage.removeItem('tichi_token');
    return rejectWithValue(err.response?.data?.error || 'Session expired');
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await authApi.login({ email, password });
    if (data.token) {
      localStorage.setItem('tichi_token', data.token);
    }
    return data;
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
    const data = await authApi.register(formData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Registration failed');
  }
});

export const verifyEmailOtp = createAsyncThunk('auth/verifyEmailOtp', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const data = await authApi.verifyEmail({ email, otp });
    if (data.token) {
      localStorage.setItem('tichi_token', data.token);
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Verification failed');
  }
});

export const resendOtpCode = createAsyncThunk('auth/resendOtpCode', async (email, { rejectWithValue }) => {
  try {
    const data = await authApi.resendOtp(email);
    return data.message;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to resend OTP');
  }
});

export const updateProfileSettings = createAsyncThunk('auth/updateProfileSettings', async (formData, { rejectWithValue }) => {
  try {
    const data = await authApi.updateSettings(formData);
    return data.user;
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
        state.error = action.payload?.error || 'Login failed';
        if (action.payload?.requiresVerification) {
          state.pendingVerificationEmail = action.payload.email;
          state.showOtpModal = true;
        }
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
        if (action.payload.user?.role === 'USER') {
          state.pendingVerificationEmail = action.payload.user.email;
          state.showOtpModal = true;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

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

      .addCase(updateProfileSettings.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearAuthMessages, setShowOtpModal, setPendingEmail } = authSlice.actions;
export default authSlice.reducer;
