'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { PublicNavbar } from '../../components/layout/PublicNavbar.js';
import { Footer } from '../../components/layout/Footer.js';
import { fetchPlans } from '../../redux/slices/planSlice.js';
import { fetchUser } from '../../redux/slices/authSlice.js';
import { Shield, Lock, CreditCard, ArrowRight, AlertCircle, User, Phone, Mail, ExternalLink, Sparkles } from 'lucide-react';
import { apiClient } from '../../redux/api/apiClient.js';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planIdParam = searchParams.get('planId');

  const dispatch = useDispatch();
  const router = useRouter();
  const { plans = [] } = useSelector((state) => state.plan || {});
  const { token, user, registrationToken } = useSelector((state) => state.auth || {});

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchPlans());
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, token, user]);

  const selectedPlan = plans.find((p) => p.id === planIdParam) || plans[0] || {
    id: 'plan_yearly_24',
    name: 'Sakhi Suraksha 365 Yearly Protection Plan',
    basePrice: 24.0,
    gstPercentage: 18.0,
    totalPrice: 28.32,
    durationDays: 365,
  };

  const basePrice = Number(selectedPlan.basePrice || 24.0);
  const gstRate = Number(selectedPlan.gstPercentage || 18.0);
  const gstAmount = Number(((basePrice * gstRate) / 100).toFixed(2));
  const totalPrice = Number((basePrice + gstAmount).toFixed(2));

  const currentRegToken = registrationToken || (typeof window !== 'undefined' ? localStorage.getItem('tichi_reg_token') : null);

  // Decode subscriber details from registration token if not logged in
  let subscriberInfo = user || {};
  if ((!subscriberInfo || !subscriberInfo.email) && currentRegToken) {
    try {
      const payload = JSON.parse(atob(currentRegToken.split('.')[1]));
      subscriberInfo = {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        emergencyContactName: payload.emergencyContactName,
        emergencyContactPhone: payload.emergencyContactPhone,
      };
    } catch (e) {
      console.warn('Could not decode registrationToken:', e.message);
    }
  }

  // 1. Full PayU Payment Form Redirection Integration
  const handlePayUGatewayRedirect = async () => {
    if (!token && !currentRegToken) {
      router.push('/auth?mode=register');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await apiClient.post('/payment/payu-initiate', {
        planId: selectedPlan.id,
        amount: totalPrice,
        registrationToken: currentRegToken,
      });
      const payData = res.data?.paymentData;

      if (!payData || !payData.actionUrl || !payData.hash) {
        throw new Error('PayU payment gateway initialization failed. Missing hash/actionUrl.');
      }

      // Create a hidden form to submit POST request directly to PayU Gateway
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payData.actionUrl;

      const fields = {
        key: payData.key,
        txnid: payData.txnid,
        amount: payData.amount,
        productinfo: payData.productinfo,
        firstname: payData.firstname,
        email: payData.email,
        phone: payData.phone || '9876543210',
        surl: payData.surl,
        furl: payData.furl,
        hash: payData.hash,
        service_provider: 'payu_paisa',
      };

      Object.entries(fields).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = v || '';
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('PayU Initiate Error:', err);
      setError(err.response?.data?.error || err.message || 'Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  // 2. Local Test Payment Simulation (Instant DB Creation & Activation)
  const handleTestSimulatedPayment = async () => {
    if (!token && !currentRegToken) {
      router.push('/auth?mode=register');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await apiClient.post('/payment/payu-initiate', {
        planId: selectedPlan.id,
        amount: totalPrice,
        registrationToken: currentRegToken,
      });
      const txnid = res.data?.paymentData?.txnid || `VEAGLE_${Date.now()}`;

      const successRes = await apiClient.post('/payment/payu-success', {
        txnid,
        mihpayid: `PAYU_TEST_${Date.now()}`,
        mode: 'UPI_TEST',
        status: 'success',
        registrationToken: currentRegToken,
      });

      if (successRes.data?.token) {
        localStorage.setItem('tichi_token', successRes.data.token);
        localStorage.removeItem('tichi_reg_token');
        localStorage.removeItem('tichi_pending_token');
        await dispatch(fetchUser());
      }

      router.push(`/payment/success?txnid=${txnid}&plan=${encodeURIComponent(selectedPlan.name)}&amount=${totalPrice}`);
    } catch (err) {
      console.error('Simulated PayU Error:', err);
      setError(err.response?.data?.error || err.message || 'Simulated payment failed.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-tichi-text font-sans relative overflow-hidden flex flex-col">
      <PublicNavbar />

      {/* BACKGROUND MESHES */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-rose/15 blur-[150px] top-[-100px] left-[-200px] pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] rounded-full bg-gold/15 blur-[150px] bottom-[100px] right-[-200px] pointer-events-none" />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full relative z-10 space-y-8">
        
        {/* PAGE HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-white text-rose border border-rose/30 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <CreditCard className="w-4 h-4 text-rose" />
            <span>Order Summary & PayU Checkout</span>
          </div>
          <h1 className="text-3xl font-black text-tichi-text">Complete Your Protection Plan</h1>
          <p className="text-xs font-semibold text-tichi-muted">
            Review your plan summary with itemized GST breakdown before PayU payment activation.
          </p>
        </div>

        {error && (
          <div className="bg-rose/15 border-2 border-rose text-rose p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-sm animate-fade-up">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* USER & GUARDIAN SUMMARY (2 COLS) */}
          <div className="md:col-span-2 card-antique-pink p-6 space-y-5 border border-[#FFCCE1]">
            <h3 className="text-sm font-black text-tichi-text uppercase tracking-wider border-b border-[#FFCCE1] pb-3">
              Subscriber Details
            </h3>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-rose shrink-0" />
                <div>
                  <span className="text-tichi-muted block text-[10px] uppercase font-bold">Full Name</span>
                  <span className="font-bold text-tichi-text">{subscriberInfo?.fullName || 'Sakhi Member'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-rose shrink-0" />
                <div>
                  <span className="text-tichi-muted block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="font-mono text-tichi-text">{subscriberInfo?.email || 'Registered Email'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-rose shrink-0" />
                <div>
                  <span className="text-tichi-muted block text-[10px] uppercase font-bold">Mobile Number</span>
                  <span className="font-mono text-tichi-text">{subscriberInfo?.phone || '+91 Mobile Number'}</span>
                </div>
              </div>

              {subscriberInfo?.emergencyContactName && (
                <div className="flex items-center space-x-3 border-t border-[#FFCCE1] pt-3">
                  <Shield className="w-4 h-4 text-rose shrink-0" />
                  <div>
                    <span className="text-tichi-muted block text-[10px] uppercase font-bold">Guardian Contact</span>
                    <span className="font-bold text-tichi-text">{subscriberInfo.emergencyContactName} ({subscriberInfo.emergencyContactPhone})</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ITEMIZED BILLING SUMMARY (3 COLS) */}
          <div className="md:col-span-3 card-antique-pink p-8 border-2 border-rose shadow-coral-glow space-y-6">
            
            <div className="flex items-center space-x-3 border-b border-[#FFCCE1] pb-4">
              <div className="w-12 h-12 rounded-xl bg-rose/15 text-rose border border-rose/30 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-tichi-text">{selectedPlan.name}</h3>
                <span className="text-xs text-rose font-bold uppercase">{selectedPlan.durationDays || 365} Days Unlimited Protection</span>
              </div>
            </div>

            {/* ITEMIZED PRICING BREAKDOWN */}
            <div className="bg-blush-subtle p-5 rounded-2xl border border-[#FFCCE1] space-y-3 text-xs font-bold">
              <div className="flex justify-between items-center text-tichi-muted">
                <span>Base Plan Price (Without GST):</span>
                <span className="font-mono text-tichi-text text-sm font-black">₹{basePrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-tichi-muted">
                <span>Added GST ({gstRate}%):</span>
                <span className="font-mono text-tichi-text text-sm font-black">₹{gstAmount.toFixed(2)}</span>
              </div>

              <div className="border-t border-[#FFCCE1] pt-3 flex justify-between items-center text-tichi-text">
                <span className="font-black text-sm uppercase text-rose">Total Payable Amount:</span>
                <span className="font-mono text-2xl font-black text-rose">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* PAYMENT ACTIONS */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handlePayUGatewayRedirect}
                disabled={isProcessing}
                className="w-full btn-baby-pink py-4 text-xs sm:text-sm uppercase tracking-wider shadow-coral-glow flex items-center justify-center space-x-2 font-black cursor-pointer"
              >
                <span>
                  {isProcessing ? 'REDIRECTING TO PAYU GATEWAY...' : `PROCEED TO PAYU PAYMENT GATEWAY (₹${totalPrice.toFixed(2)})`}
                </span>
                <ExternalLink className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleTestSimulatedPayment}
                disabled={isProcessing}
                className="w-full bg-white hover:bg-rose/5 text-rose border-2 border-rose/40 py-3 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulate PayU Test Payment Success (Instant Activation)</span>
              </button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-tichi-muted font-bold pt-1">
                <Lock className="w-3.5 h-3.5 text-tichi-success" />
                <span>256-Bit SSL Encrypted Official PayU Payment Gateway</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF0F3] flex items-center justify-center font-bold text-rose">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
