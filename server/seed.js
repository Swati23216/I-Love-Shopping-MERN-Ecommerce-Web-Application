require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDatabase = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

const products = [
  {
    name: 'Linen Lounge Chair',
    description: 'A comfortable, considered accent chair for slow mornings and cozy evenings.',
    price: 18999,
    category: 'Furniture',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Hand-finished Ceramic Vase',
    description: 'A sculptural ceramic vase that brings a soft, natural detail to your room.',
    price: 1899,
    category: 'Home decor',
    stock: 24,
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Everyday Cotton Shirt',
    description: 'An easy, breathable cotton shirt made for everyday plans.',
    price: 2499,
    category: 'Clothes',
    stock: 32,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Wireless Headphones',
    description: 'Comfortable wireless headphones for your favorite music and podcasts.',
    price: 6499,
    category: 'Electronics',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Daily Glow Skincare Set',
    description: 'A gentle everyday skincare set to make your daily routine feel special.',
    price: 1599,
    category: 'Beauty products',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
  },
];

async function seed() {
  await connectDatabase();

  const password = await bcrypt.hash(adminPassword, 10);
  await User.findOneAndUpdate(
    {email: adminEmail.toLowerCase()},
    {
      $set: {name: 'Store Admin', password, role: 'admin'},
      $setOnInsert: {email: adminEmail.toLowerCase()},
    },
    {upsert: true, runValidators: true, setDefaultsOnInsert: true},
  );

  for (const product of products) {
    await Product.updateOne(
      {name: product.name, category: product.category},
      {$setOnInsert: product},
      {upsert: true, runValidators: true},
    );
  }

  const [users, productCount] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
  ]);
  console.log(`Seed complete in database "${mongoose.connection.name}".`);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
  console.log(`Existing records were preserved. Database now contains ${users} users and ${productCount} products.`);
}

seed()
  .catch(error => {
    console.error('Database seed failed:', error.name);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
