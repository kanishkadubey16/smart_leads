import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import { User } from '../models/user.model';
import { Lead } from '../models/lead.model';
import { Role } from '../types';

dotenv.config();

const INITIAL_LEADS = [
  { name: 'Tony Stark', email: 'tony@stark.com', status: 'New', source: 'Email Campaign', createdAt: '2023-10-20T10:30:00Z' },
  { name: 'Steve Rogers', email: 'steve@avengers.gov', status: 'Lost', source: 'Cold Call', createdAt: '2023-10-19T09:15:00Z' },
  { name: 'Rachel Green', email: 'rachel@friends.com', status: 'Qualified', source: 'LinkedIn', createdAt: '2023-10-18T14:45:00Z' },
  { name: 'Quentin Tarantino', email: 'quentin@movies.com', status: 'Contacted', source: 'Referral', createdAt: '2023-10-17T11:20:00Z' },
  { name: 'Pam Beesly', email: 'pam@dundermifflin.com', status: 'New', source: 'Website', createdAt: '2023-10-16T16:10:00Z' },
  { name: 'Oscar Wilde', email: 'oscar@literature.org', status: 'Qualified', source: 'Email Campaign', createdAt: '2023-10-15T08:50:00Z' },
  { name: 'Bruce Wayne', email: 'bruce@waynecorp.com', status: 'Contacted', source: 'Referral', createdAt: '2023-10-14T17:35:00Z' },
  { name: 'Clark Kent', email: 'clark@dailyplanet.com', status: 'New', source: 'Website', createdAt: '2023-10-13T12:05:00Z' },
  { name: 'Peter Parker', email: 'peter@dailybugle.com', status: 'New', source: 'LinkedIn', createdAt: '2023-10-12T15:22:00Z' },
  { name: 'Diana Prince', email: 'diana@themyscira.gov', status: 'Qualified', source: 'Cold Call', createdAt: '2023-10-11T10:40:00Z' },
  { name: 'Barry Allen', email: 'barry@star-labs.com', status: 'Contacted', source: 'Referral', createdAt: '2023-10-10T09:00:00Z' },
  { name: 'Hal Jordan', email: 'hal@ferrisair.com', status: 'Lost', source: 'Email Campaign', createdAt: '2023-10-09T13:18:00Z' },
  { name: 'Arthur Curry', email: 'arthur@atlantis.gov', status: 'New', source: 'Website', createdAt: '2023-10-08T11:55:00Z' },
  { name: 'Victor Stone', email: 'victor@star-labs.com', status: 'Lost', source: 'Cold Call', createdAt: '2023-10-07T14:12:00Z' },
  { name: 'Bruce Banner', email: 'banner@culver.edu', status: 'Qualified', source: 'LinkedIn', createdAt: '2023-10-06T15:30:00Z' },
  { name: 'Natasha Romanoff', email: 'natasha@shield.gov', status: 'Contacted', source: 'Email Campaign', createdAt: '2023-10-05T08:25:00Z' },
  { name: 'Clint Barton', email: 'clint@shield.gov', status: 'New', source: 'Cold Call', createdAt: '2023-10-04T16:50:00Z' },
  { name: 'Wanda Maximoff', email: 'wanda@avengers.gov', status: 'Qualified', source: 'Website', createdAt: '2023-10-03T11:15:00Z' },
  { name: 'Vision', email: 'vision@stark.com', status: 'Contacted', source: 'Referral', createdAt: '2023-10-02T10:00:00Z' },
  { name: 'Sam Wilson', email: 'sam@shield.gov', status: 'Lost', source: 'LinkedIn', createdAt: '2023-10-01T14:20:00Z' }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Lead.deleteMany();

    console.log('Creating Admin User...');
    const adminUser = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@smartleads.app',
      password: 'password', // Will be hashed automatically by User model pre-save hook
      role: Role.ADMIN,
    });

    console.log('Seeding Mock Leads...');
    const leadsWithUser = INITIAL_LEADS.map(lead => ({
      ...lead,
      createdBy: adminUser._id,
    }));

    await Lead.insertMany(leadsWithUser);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
