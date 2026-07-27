import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { config } from './config';
import apiRouter from './routes/api';
import { prisma } from './config/prisma';
import bcrypt from 'bcryptjs';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', app: 'Tichi Suraksha Emergency Server', timestamp: new Date().toISOString() });
});

// Socket.IO Real-Time GPS Engine
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join-room', (room: string) => {
    socket.join(room);
    console.log(`[Socket.IO] ${socket.id} joined room ${room}`);
  });

  socket.on('sos:location-update', (data: { token: string; lat: number; lng: number; accuracy?: number }) => {
    // Broadcast location update to viewers in the specific room
    io.to(`track:${data.token}`).emit('location-updated', {
      latitude: data.lat,
      longitude: data.lng,
      accuracy: data.accuracy || 10,
      timestamp: new Date().toISOString(),
    });
    // Also notify admin room
    io.to('admin-ops').emit('admin:sos-location', data);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Seeding default demo data if database is empty
async function seedDefaultData() {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('[Seed] Seeding initial demo account Priya Sharma...');
      const passwordHash = await bcrypt.hash('Priya123!', 10);
      const demoUser = await prisma.user.create({
        data: {
          fullName: 'Priya Sharma',
          email: 'priya@tichisuraksha.org',
          phone: '+91 98765 43210',
          passwordHash,
          onboardingStep: 7,
          trustedContacts: {
            create: [
              { name: 'Ananya Sharma (Sister)', relationship: 'Sister', phone: '+91 98765 11111', email: 'ananya@tichisuraksha.org', isVerified: true, priorityOrder: 1 },
              { name: 'Rajesh Sharma (Dad)', relationship: 'Father', phone: '+91 98765 22222', email: 'dad@tichisuraksha.org', isVerified: true, priorityOrder: 2 },
              { name: 'Neha Gupta (Friend)', relationship: 'Friend', phone: '+91 98765 33333', email: 'neha@tichisuraksha.org', isVerified: true, priorityOrder: 3 },
            ],
          },
        },
      });
      console.log(`[Seed] Demo account created: priya@tichisuraksha.org / Priya123!`);
    }
  } catch (err) {
    console.error('[Seed Error]:', err);
  }
}

server.listen(config.port, async () => {
  console.log(`====================================================`);
  console.log(`🚨 TICHI SURAKSHA BACKEND SERVER LISTENING ON PORT ${config.port}`);
  console.log(`====================================================`);
  await seedDefaultData();
});
