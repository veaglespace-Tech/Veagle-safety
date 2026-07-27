import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const fetchPlans = createAsyncThunk('plan/fetchPlans', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/plans');
    return res.data.plans || [];
  } catch (err) {
    // Fallback default safety plans if admin hasn't created plans yet
    return [
      {
        id: 'plan_basic',
        name: 'Basic Shield Protection',
        description: 'Essential 24/7 GPS Tracking & SOS Emergency Broadcast to 5 Contacts',
        basePrice: 24,
        gstPercentage: 18,
        totalPrice: 28.32,
        durationDays: 30,
      },
      {
        id: 'plan_premium',
        name: 'Premium Guardian Elite',
        description: 'Priority SOS Broadcast, Automated Check-in Escalation & Live Dispatch Hotline',
        basePrice: 79,
        gstPercentage: 18,
        totalPrice: 93.22,
        durationDays: 90,
      },
    ];
  }
});

export const initiatePayUCheckout = createAsyncThunk('plan/initiatePayUCheckout', async ({ planId, amount }, { rejectWithValue }) => {
  try {
    const res = await api.post('/payment/payu-initiate', { planId, amount });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Payment initiation failed');
  }
});

const planSlice = createSlice({
  name: 'plan',
  initialState: {
    plans: [],
    selectedPlan: null,
    isLoading: false,
    paymentData: null,
    error: null,
  },
  reducers: {
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(initiatePayUCheckout.fulfilled, (state, action) => {
        state.paymentData = action.payload;
      });
  },
});

export const { setSelectedPlan } = planSlice.actions;
export default planSlice.reducer;
