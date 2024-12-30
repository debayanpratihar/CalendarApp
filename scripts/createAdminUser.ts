import mongoose from 'mongoose';
import User from '../app/models/User';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://calen:calen@cluster0.keie8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function createAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'debayanpratihar1234@gmail.com';
    const adminPassword = 'Debayan@1234';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const adminUser = new User({
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();
