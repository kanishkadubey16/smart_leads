"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_leads';
// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception thrown!', err);
    process.exit(1);
});
// Establish Mongoose MongoDB Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(MONGO_URI);
        console.log(`=========================================`);
        console.log(`🔋 MongoDB Database Connection Success!`);
        console.log(`🔌 Connected Host: ${conn.connection.host}`);
        console.log(`📂 Database Name: ${conn.connection.name}`);
        console.log(`=========================================`);
    }
    catch (error) {
        console.error('Database connection error occurred:', error);
        process.exit(1);
    }
};
// Boot MERN Backend
const startServer = async () => {
    await connectDB();
    const server = app_1.default.listen(PORT, () => {
        console.log(`🚀 Smart Leads CRM Backend Service Started!`);
        console.log(`🔌 Listening on: http://localhost:${PORT}`);
        console.log(`🔧 Mode: ${process.env.NODE_ENV || 'development'}`);
        console.log(`=========================================`);
    });
    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
        console.error('CRITICAL: Unhandled Promise Rejection occurred!', err);
        server.close(() => {
            process.exit(1);
        });
    });
};
startServer();
