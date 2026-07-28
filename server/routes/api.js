import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as contactController from '../controllers/contactController.js';
import * as sosController from '../controllers/sosController.js';
import * as journeyController from '../controllers/journeyController.js';
import * as checkinController from '../controllers/checkinController.js';
import * as adminController from '../controllers/adminController.js';
import * as paymentController from '../controllers/paymentController.js';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

// Auth & User
router.post('/auth/register', authController.register);
router.post('/auth/verify-email', authController.verifyEmail);
router.post('/auth/resend-otp', authController.resendOtp);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', authenticateToken, authController.getProfile);
router.put('/auth/settings', authenticateToken, authController.updateSettings);

// Public Plans & Pricing
router.get('/plans', adminController.getPlans);

// PayU Payment Routes
router.post('/payment/payu-initiate', authenticateToken, paymentController.initiatePayUPayment);
router.post('/payment/payu-success', paymentController.handlePayUSuccess);
router.get('/payment/payu-success', paymentController.handlePayUSuccess);
router.post('/payment/payu-failure', paymentController.handlePayUFailure);
router.get('/payment/payu-failure', paymentController.handlePayUFailure);
router.get('/payment/history', authenticateToken, paymentController.getUserPaymentHistory);

// Contacts
router.get('/contacts', authenticateToken, contactController.getContacts);
router.post('/contacts', authenticateToken, contactController.addContact);
router.delete('/contacts/:id', authenticateToken, contactController.deleteContact);

// SOS
router.post('/sos/start', authenticateToken, sosController.startSos);
router.post('/sos/location', authenticateToken, sosController.updateSosLocation);
router.post('/sos/resolve', authenticateToken, sosController.resolveSos);
router.get('/sos/active', authenticateToken, sosController.getActiveSosSession);
router.get('/sos/public-track/:token', sosController.getPublicSosTracking);

// Journey
router.post('/journey/start', authenticateToken, journeyController.startJourney);
router.post('/journey/complete', authenticateToken, journeyController.completeJourney);
router.get('/journey/active', authenticateToken, journeyController.getActiveJourney);

// Check-in
router.post('/checkin/start', authenticateToken, checkinController.startCheckin);
router.post('/checkin/safe', authenticateToken, checkinController.confirmCheckinSafe);
router.get('/checkin/active', authenticateToken, checkinController.getActiveCheckin);

// Super Admin Operations Command Portal
router.get('/admin/overview', authenticateToken, requireSuperAdmin, adminController.getAdminOverview);
router.get('/admin/users', authenticateToken, requireSuperAdmin, adminController.getAllUsers);
router.put('/admin/user/role', authenticateToken, requireSuperAdmin, adminController.updateUserRole);
router.post('/admin/sos/resolve', authenticateToken, requireSuperAdmin, adminController.adminResolveSos);
router.get('/admin/plans', authenticateToken, requireSuperAdmin, adminController.getPlans);
router.post('/admin/plans', authenticateToken, requireSuperAdmin, adminController.createOrUpdatePlan);
router.get('/admin/gst', authenticateToken, requireSuperAdmin, adminController.getGstSettings);
router.put('/admin/gst', authenticateToken, requireSuperAdmin, adminController.updateGstSettings);
router.get('/admin/payments', authenticateToken, requireSuperAdmin, adminController.getPaymentHistory);

export default router;
