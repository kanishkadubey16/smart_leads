"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDB = exports.loadDB = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_DIR = path_1.default.join(__dirname, '../../data');
const DB_FILE = path_1.default.join(DATA_DIR, 'db.json');
const INITIAL_LEADS = [
    {
        id: 'lead-1',
        name: 'Tony Stark',
        email: 'tony@stark.com',
        status: 'New',
        source: 'Email Campaign',
        createdAt: '2023-10-20T10:30:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-2',
        name: 'Steve Rogers',
        email: 'steve@avengers.gov',
        status: 'Lost',
        source: 'Cold Call',
        createdAt: '2023-10-19T09:15:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-3',
        name: 'Rachel Green',
        email: 'rachel@friends.com',
        status: 'Qualified',
        source: 'LinkedIn',
        createdAt: '2023-10-18T14:45:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-4',
        name: 'Quentin Tarantino',
        email: 'quentin@movies.com',
        status: 'Contacted',
        source: 'Referral',
        createdAt: '2023-10-17T11:20:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-5',
        name: 'Pam Beesly',
        email: 'pam@dundermifflin.com',
        status: 'New',
        source: 'Website',
        createdAt: '2023-10-16T16:10:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-6',
        name: 'Oscar Wilde',
        email: 'oscar@literature.org',
        status: 'Qualified',
        source: 'Email Campaign',
        createdAt: '2023-10-15T08:50:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-7',
        name: 'Bruce Wayne',
        email: 'bruce@waynecorp.com',
        status: 'Contacted',
        source: 'Referral',
        createdAt: '2023-10-14T17:35:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-8',
        name: 'Clark Kent',
        email: 'clark@dailyplanet.com',
        status: 'New',
        source: 'Website',
        createdAt: '2023-10-13T12:05:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-9',
        name: 'Peter Parker',
        email: 'peter@dailybugle.com',
        status: 'New',
        source: 'LinkedIn',
        createdAt: '2023-10-12T15:22:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-10',
        name: 'Diana Prince',
        email: 'diana@themyscira.gov',
        status: 'Qualified',
        source: 'Cold Call',
        createdAt: '2023-10-11T10:40:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-11',
        name: 'Barry Allen',
        email: 'barry@star-labs.com',
        status: 'Contacted',
        source: 'Referral',
        createdAt: '2023-10-10T09:00:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-12',
        name: 'Hal Jordan',
        email: 'hal@ferrisair.com',
        status: 'Lost',
        source: 'Email Campaign',
        createdAt: '2023-10-09T13:18:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-13',
        name: 'Arthur Curry',
        email: 'arthur@atlantis.gov',
        status: 'New',
        source: 'Website',
        createdAt: '2023-10-08T11:55:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-14',
        name: 'Victor Stone',
        email: 'victor@star-labs.com',
        status: 'Lost',
        source: 'Cold Call',
        createdAt: '2023-10-07T14:12:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-15',
        name: 'Bruce Banner',
        email: 'banner@culver.edu',
        status: 'Qualified',
        source: 'LinkedIn',
        createdAt: '2023-10-06T15:30:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-16',
        name: 'Natasha Romanoff',
        email: 'natasha@shield.gov',
        status: 'Contacted',
        source: 'Email Campaign',
        createdAt: '2023-10-05T08:25:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-17',
        name: 'Clint Barton',
        email: 'clint@shield.gov',
        status: 'New',
        source: 'Cold Call',
        createdAt: '2023-10-04T16:50:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-18',
        name: 'Wanda Maximoff',
        email: 'wanda@avengers.gov',
        status: 'Qualified',
        source: 'Website',
        createdAt: '2023-10-03T11:15:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-19',
        name: 'Vision',
        email: 'vision@stark.com',
        status: 'Contacted',
        source: 'Referral',
        createdAt: '2023-10-02T10:00:00Z',
        createdBy: 'user-1',
    },
    {
        id: 'lead-20',
        name: 'Sam Wilson',
        email: 'sam@shield.gov',
        status: 'Lost',
        source: 'LinkedIn',
        createdAt: '2023-10-01T14:20:00Z',
        createdBy: 'user-1',
    },
];
const loadDB = () => {
    if (!fs_1.default.existsSync(DATA_DIR)) {
        fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs_1.default.existsSync(DB_FILE)) {
        const defaultUser = {
            id: 'user-1',
            name: 'Sarah Johnson',
            email: 'sarah@smartleads.app',
            role: 'ADMIN',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
            // password is "password", pre-hashed using bcrypt
            password: '$2a$10$954aN/c0hPNDk4BveaP1G.gQ1lM9a.ZsnT8HjM0i6Rukrly3g1GEC',
        };
        const initialDB = {
            users: [defaultUser],
            leads: INITIAL_LEADS,
        };
        fs_1.default.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
        return initialDB;
    }
    return JSON.parse(fs_1.default.readFileSync(DB_FILE, 'utf-8'));
};
exports.loadDB = loadDB;
const saveDB = (db) => {
    if (!fs_1.default.existsSync(DATA_DIR)) {
        fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs_1.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
};
exports.saveDB = saveDB;
