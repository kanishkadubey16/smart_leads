"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
const Lead_1 = require("../models/Lead");
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_leads';
const SEED_LEADS = [
    {
        name: 'Tony Stark',
        email: 'tony@stark.com',
        status: 'New',
        source: 'Referral',
        createdAt: new Date('2023-10-20T10:30:00Z'),
    },
    {
        name: 'Steve Rogers',
        email: 'steve@avengers.gov',
        status: 'Lost',
        source: 'Website',
        createdAt: new Date('2023-10-19T09:15:00Z'),
    },
    {
        name: 'Rachel Green',
        email: 'rachel@friends.com',
        status: 'Qualified',
        source: 'Instagram',
        createdAt: new Date('2023-10-18T14:45:00Z'),
    },
    {
        name: 'Quentin Tarantino',
        email: 'quentin@movies.com',
        status: 'Contacted',
        source: 'Referral',
        createdAt: new Date('2023-10-17T11:20:00Z'),
    },
    {
        name: 'Pam Beesly',
        email: 'pam@dundermifflin.com',
        status: 'New',
        source: 'Website',
        createdAt: new Date('2023-10-16T16:10:00Z'),
    },
    {
        name: 'Oscar Wilde',
        email: 'oscar@literature.org',
        status: 'Qualified',
        source: 'Referral',
        createdAt: new Date('2023-10-15T08:50:00Z'),
    },
    {
        name: 'Bruce Wayne',
        email: 'bruce@waynecorp.com',
        status: 'Contacted',
        source: 'Referral',
        createdAt: new Date('2023-10-14T17:35:00Z'),
    },
    {
        name: 'Clark Kent',
        email: 'clark@dailyplanet.com',
        status: 'New',
        source: 'Website',
        createdAt: new Date('2023-10-13T12:05:00Z'),
    },
    {
        name: 'Peter Parker',
        email: 'peter@dailybugle.com',
        status: 'New',
        source: 'Instagram',
        createdAt: new Date('2023-10-12T15:22:00Z'),
    },
    {
        name: 'Diana Prince',
        email: 'diana@themyscira.gov',
        status: 'Qualified',
        source: 'Website',
        createdAt: new Date('2023-10-11T10:40:00Z'),
    },
    {
        name: 'Barry Allen',
        email: 'barry@star-labs.com',
        status: 'Contacted',
        source: 'Referral',
        createdAt: new Date('2023-10-10T09:00:00Z'),
    },
    {
        name: 'Hal Jordan',
        email: 'hal@ferrisair.com',
        status: 'Lost',
        source: 'Website',
        createdAt: new Date('2023-10-09T13:18:00Z'),
    },
    {
        name: 'Arthur Curry',
        email: 'arthur@atlantis.gov',
        status: 'New',
        source: 'Website',
        createdAt: new Date('2023-10-08T11:55:00Z'),
    },
    {
        name: 'Victor Stone',
        email: 'victor@star-labs.com',
        status: 'Lost',
        source: 'Website',
        createdAt: new Date('2023-10-07T14:12:00Z'),
    },
    {
        name: 'Bruce Banner',
        email: 'banner@culver.edu',
        status: 'Qualified',
        source: 'Instagram',
        createdAt: new Date('2023-10-06T15:30:00Z'),
    },
    {
        name: 'Natasha Romanoff',
        email: 'natasha@shield.gov',
        status: 'Contacted',
        source: 'Website',
        createdAt: new Date('2023-10-05T08:25:00Z'),
    },
    {
        name: 'Clint Barton',
        email: 'clint@shield.gov',
        status: 'New',
        source: 'Referral',
        createdAt: new Date('2023-10-04T16:50:00Z'),
    },
    {
        name: 'Wanda Maximoff',
        email: 'wanda@avengers.gov',
        status: 'Qualified',
        source: 'Website',
        createdAt: new Date('2023-10-03T11:15:00Z'),
    },
    {
        name: 'Vision',
        email: 'vision@stark.com',
        status: 'Contacted',
        source: 'Referral',
        createdAt: new Date('2023-10-02T10:00:00Z'),
    },
    {
        name: 'Sam Wilson',
        email: 'sam@shield.gov',
        status: 'Lost',
        source: 'Instagram',
        createdAt: new Date('2023-10-01T14:20:00Z'),
    },
];
const seedDatabase = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose_1.default.connect(MONGO_URI);
        console.log('Connected to MongoDB.');
        // 1. Clear current database collections
        console.log('Clearing database collections User and Lead...');
        await Promise.all([User_1.User.deleteMany({}), Lead_1.Lead.deleteMany({})]);
        console.log('Collections cleared.');
        // 2. Create the default admin account
        console.log('Seeding Sarah Johnson admin account...');
        const adminUser = await User_1.User.create({
            name: 'Sarah Johnson',
            email: 'sarah@smartleads.app',
            password: 'password', // Auto hashed by pre-save hooks
            role: 'admin',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
        });
        console.log(`Sarah Johnson seeded successfully with ID: ${adminUser.id}`);
        // 3. Map leads to the newly created admin user ID and insert
        console.log('Mapping leads to seeded Admin ID and inserting...');
        const mappedLeads = SEED_LEADS.map((lead) => ({
            ...lead,
            createdBy: adminUser._id,
        }));
        await Lead_1.Lead.insertMany(mappedLeads);
        console.log(`Successfully seeded ${mappedLeads.length} leads in MongoDB!`);
        console.log('=========================================');
        console.log('🏆 Database Seeding Completed Successfully!');
        console.log('=========================================');
        process.exit(0);
    }
    catch (error) {
        console.error('Error occurred seeding MERN database:', error);
        process.exit(1);
    }
};
seedDatabase();
