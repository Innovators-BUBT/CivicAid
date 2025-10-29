const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up CivicAid project...\n');

// Create backend .env file
const backendEnvContent = `PORT=5000
MONGO_URI=mongodb://localhost:27017/civicaid
JWT_SECRET=civicaid_jwt_secret_key_2024_enhanced
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Configuration (Optional - for password reset emails)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin Registration Code
ADMIN_CODE=01642406871

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`;

const backendEnvPath = path.join(__dirname, 'backend', '.env');

try {
  if (!fs.existsSync(backendEnvPath)) {
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log('✅ Created backend/.env file');
  } else {
    console.log('ℹ️  backend/.env file already exists');
  }
} catch (error) {
  console.log('⚠️  Could not create backend/.env file. Please create it manually.');
}

console.log('\n📋 Setup Instructions:');
console.log('\n1. Install backend dependencies:');
console.log('   cd backend');
console.log('   npm install');
console.log('\n2. Install frontend dependencies:');
console.log('   cd frontend');
console.log('   npm install');
console.log('\n3. Start MongoDB (if using local):');
console.log('   mongod');
console.log('\n4. Start backend server:');
console.log('   cd backend');
console.log('   npm run server');
console.log('\n5. Start frontend development server:');
console.log('   cd frontend');
console.log('   npm start');
console.log('\n🌐 The application will be available at:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:5000');
console.log('\n📝 Note: Make sure MongoDB is running before starting the backend server.'); 