import { Router } from 'express';
import * as authController from '../controllers/authController';
import * as contactController from '../controllers/contactController';
import * as sosController from '../controllers/sosController';
import * as journeyController from '../controllers/journeyController';
import * as checkinController from '../controllers/checkinController';
import * as adminController from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Auth & User
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.getProfile);
router.put('/auth/settings', authenticateToken, authController.updateSettings);

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

// Admin Operations Portal
router.get('/admin/overview', adminController.getAdminOverview);

export default router;
