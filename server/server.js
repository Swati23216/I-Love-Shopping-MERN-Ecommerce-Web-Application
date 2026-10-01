require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDatabase = require('./config/db');

const app = express();
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.set('etag', false);
app.use(cors({origin: clientUrl}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.get('/', (req, res) => res.json({
  name: 'I Love Shopping API',
  status: 'ok',
  frontend: clientUrl,
  health: '/api/health',
}));

app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'database unavailable',
    database: connected ? mongoose.connection.name : null,
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({message: 'Server error'});
});

async function start() {
  try {
    await connectDatabase();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (error) {
    console.error('MongoDB connection failed. Check the URI, credentials, network access, and database name.');
    console.error(`Connection error type: ${error.name}`);
    process.exitCode = 1;
  }
}

start();
