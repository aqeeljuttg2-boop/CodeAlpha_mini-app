require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const exploreRoutes = require('./routes/exploreRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/explore', exploreRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Project Management API Running...');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route Not Found' });
});

// Start server after DB connection
const startServer = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Unable to connect to MongoDB – server not started');
    process.exit(1);
  }
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
  });
};

startServer();