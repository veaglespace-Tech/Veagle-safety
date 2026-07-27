import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { config } from './config/index.js';
import apiRouter from './routes/api.js';
import { prisma } from './config/prisma.js';
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
  res.json({ status: 'OK', app: 'Tichi Suraksha Emergency Server (JS Edition)', timestamp: new Date().toISOString() });
});

// Socket.IO Real-Time GPS Engine
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`[Socket.IO] ${socket.id} joined room ${room}`);
  });

  socket.on('sos:location-update', (data) => {
    io.to(`track:${data.token}`).emit('location-updated', {
      latitude: data.lat,
      longitude: data.lng,
      accuracy: data.accuracy || 10,
      timestamp: new Date().toISOString(),
    });
    io.to('admin-ops').emit('admin:sos-location', data);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Seeding ONLY Super Admin account
async function seedDefaultData() {
  try {
    // 1. Delete any non-Super Admin demo users if they exist
    const demoUser = await prisma.user.findFirst({ where: { email: 'priya@tichisuraksha.org' } });
    if (demoUser) {
      console.log('[Seed] Cleaning up demo user accounts...');
      await prisma.user.deleteMany({
        where: { email: 'priya@tichisuraksha.org' },
      });
      console.log('[Seed] Demo accounts removed cleanly.');
    }

    // 2. Ensure Super Admin account exists
    const adminExists = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    if (!adminExists) {
      console.log('[Seed] Seeding Super Admin account...');
      const adminPassHash = await bcrypt.hash('Admin123!', 10);
      await prisma.user.upsert({
        where: { email: 'admin@tichisuraksha.org' },
        update: { role: 'SUPER_ADMIN' },
        create: {
          fullName: 'Super Admin HQ',
          email: 'admin@tichisuraksha.org',
          phone: '+91 99000 00000',
          passwordHash: adminPassHash,
          role: 'SUPER_ADMIN',
          onboardingStep: 7,
        },
      });
      console.log('[Seed] Super Admin created: admin@tichisuraksha.org / Admin123!');
    } else {
      console.log('[Seed] Super Admin account verified.');
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
