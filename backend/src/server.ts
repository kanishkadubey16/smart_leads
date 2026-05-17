import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5050;

// Connect to Database
connectDB().then(() => {
  // Start Express Server
  const server = app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Smart Leads Backend Service Started!`);
    console.log(`🔌 Listening on: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=========================================`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: any, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
});
