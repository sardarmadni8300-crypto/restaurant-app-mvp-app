const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');

dotenv.config();

const seedData = async () => {
  try {
    // MongoDB se connect karein
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    // Pehle se mojood data clear karein
    await User.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();

    // Sample Users
    const users = await User.create([
      { name: 'Manager Ali', email: 'manager@restaurant.com', password: 'password123', role: 'manager' },
      { name: 'Customer Sara', email: 'sara@gmail.com', password: 'password123', role: 'customer' }
    ]);

    // 15 Menu Items
    const menuItems = await MenuItem.create([
      { name: 'Zinger Burger', category: 'Fast Food', price: 550, description: 'Crispy chicken burger', isAvailable: true },
      { name: 'Club Sandwich', category: 'Fast Food', price: 450, description: 'Double decker sandwich', isAvailable: true },
      { name: 'Chicken Biryani', category: 'Desi', price: 400, description: 'Spicy traditional biryani', isAvailable: true },
      { name: 'Karahi', category: 'Desi', price: 1200, description: 'Chicken local karahi', isAvailable: true },
      { name: 'Pepperoni Pizza', category: 'Pizza', price: 1400, description: 'Large crust pizza', isAvailable: true },
      { name: 'Fajita Pizza', category: 'Pizza', price: 1350, description: 'Spicy chicken fajita', isAvailable: true },
      { name: 'Pasta Alfredo', category: 'Italian', price: 900, description: 'Creamy white sauce pasta', isAvailable: true },
      { name: 'Lasagna', category: 'Italian', price: 1050, description: 'Baked beef lasagna', isAvailable: true },
      { name: 'French Fries', category: 'Sides', price: 200, description: 'Crispy salted fries', isAvailable: true },
      { name: 'Garlic Bread', category: 'Sides', price: 250, description: 'Baked with garlic butter', isAvailable: true },
      { name: 'Chocolate Brownie', category: 'Desserts', price: 300, description: 'Served with warm fudge', isAvailable: true },
      { name: 'Ice Cream Scoop', category: 'Desserts', price: 180, description: 'Vanilla flavor', isAvailable: true },
      { name: 'Mint Margarita', category: 'Beverages', price: 250, description: 'Refreshing mint drink', isAvailable: true },
      { name: 'Cold Drink', category: 'Beverages', price: 120, description: 'Soft drink 500ml', isAvailable: true },
      { name: 'Green Tea', category: 'Beverages', price: 100, description: 'Hot herbal tea', isAvailable: true }
    ]);

    // 6 Tables
    const tables = await Table.create([
      { tableNumber: 1, seats: 2, status: 'Available' },
      { tableNumber: 2, seats: 4, status: 'Available' },
      { tableNumber: 3, seats: 4, status: 'Available' },
      { tableNumber: 4, seats: 6, status: 'Available' },
      { tableNumber: 5, seats: 8, status: 'Available' },
      { tableNumber: 6, seats: 2, status: 'Available' }
    ]);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeding Error: ${error}`);
    process.exit(1);
  }
};

seedData();