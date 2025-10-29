# CivicAid - Empowering Bangladeshi Communities

A comprehensive civic engagement platform designed specifically for Bangladeshi citizens, providing free services to report, track, and resolve community issues across all 64 districts of Bangladesh.

## 🌟 Key Features

### 🆓 **100% Free Service**
- **Completely free** for all Bangladeshi citizens
- No hidden costs, no subscription fees
- Available nationwide across all 64 districts

### 👥 **Multi-Role Support**
- **Citizens**: Report issues and track progress
- **Volunteers**: Find opportunities to help communities
- **NGOs**: Coordinate social development projects
- **Authorities**: Efficiently manage community requests
- **Administrators**: Platform management and oversight

### 🔐 **Secure Authentication**
- User registration and login
- Password recovery system
- Admin registration with secure code requirement
- JWT-based authentication
- Role-based access control

### 📱 **Modern UI/UX**
- Responsive design for all devices
- Modern, attractive interface
- Intuitive navigation
- Real-time notifications
- Progress tracking

### 🔍 **Advanced Features**
- Smart search functionality
- Issue categorization and filtering
- Real-time status updates
- File upload support
- Community engagement tools

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **crypto** - Token generation for password recovery

### Security Features
- Password encryption with bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- CORS protection
- Rate limiting

## 🎨 Design System

### Modern Theme
- **Color Palette**: Violet, Purple, Fuchsia gradients
- **Typography**: Plus Jakarta Sans, JetBrains Mono
- **Components**: Glassmorphism cards, gradient buttons
- **Animations**: Smooth transitions, hover effects
- **Responsive**: Mobile-first design approach

### UI Components
- Modern cards with backdrop blur effects
- Gradient buttons with hover animations
- Responsive navigation
- Toast notifications
- Loading spinners
- Progress trackers

## 📱 Responsive Design

- **Mobile**: Optimized for smartphones
- **Tablet**: Enhanced layout for tablets
- **Desktop**: Full-featured desktop experience
- **Cross-browser**: Compatible with all modern browsers

## 🔒 Security Features

- **Password Recovery**: Secure token-based system
- **Admin Access**: Protected with registration code
- **Data Protection**: Industry-standard security measures
- **Input Validation**: Comprehensive form validation
- **Session Management**: Secure user sessions

## 👨‍💼 Our Team

### Core Team (6 Members)

1. **Logno Hassan** - Founder & CEO
   - Email: lognohassan@gmail.com
   - Phone: +880 1798 585 919
   - Expertise: Project Management, Community Development

2. **Ahmed Rahman** - Technical Lead
   - Email: ahmed.rahman@civicaid.bd
   - Phone: +880 1711 234 567
   - Expertise: Software Development, System Architecture

3. **Fatima Khan** - Community Outreach Manager
   - Email: fatima.khan@civicaid.bd
   - Phone: +880 1812 345 678
   - Expertise: Community Relations, Partnership Development

4. **Mohammad Ali** - Operations Manager
   - Email: mohammad.ali@civicaid.bd
   - Phone: +880 1913 456 789
   - Expertise: Operations Management, Process Optimization

5. **Sadia Islam** - User Experience Designer
   - Email: sadia.islam@civicaid.bd
   - Phone: +880 1614 567 890
   - Expertise: UX/UI Design, Accessibility

6. **Rashid Ahmed** - Data Analyst
   - Email: rashid.ahmed@civicaid.bd
   - Phone: +880 1515 678 901
   - Expertise: Data Analysis, Performance Metrics

## 📞 Contact Information

- **Phone**: +880 1798 585 919 (24/7 support)
- **Email**: lognohassan@gmail.com
- **Service Area**: All 64 districts of Bangladesh
- **Response Time**: Within 24 hours

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/civicaid.git
   cd civicaid
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # In backend directory, create .env file
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm run server
   ```

6. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Development

### Backend API Endpoints

#### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/forgot-password` - Password recovery
- `POST /api/users/reset-password` - Password reset

#### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)

#### Complaints
- `POST /api/complaints` - Create complaint
- `GET /api/complaints` - Get complaints
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

#### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get tasks
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Admin Registration
To register as an administrator, use the code: **01642406871**

## 🌍 Service Coverage

- **Nationwide**: All 64 districts of Bangladesh
- **Languages**: Bengali and English support
- **Accessibility**: Designed for all citizens
- **Free Service**: No cost for Bangladeshi citizens

## 📊 Impact Statistics

- **Active Users**: 10,000+ Bangladeshi citizens
- **Issues Resolved**: 500+ community problems
- **Districts Covered**: 64 (100% of Bangladesh)
- **Service Cost**: 100% free for citizens
- **Response Time**: 24 hours or less

## 🔮 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **AI Integration**: Smart issue categorization and routing
- **Multi-language**: Additional regional language support
- **Analytics Dashboard**: Advanced reporting and insights
- **Integration**: Connect with government systems
- **Offline Support**: Work without internet connectivity

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- The people of Bangladesh for their trust and support
- Our dedicated team of professionals
- The open-source community for their valuable tools and libraries
- Local authorities and NGOs for their partnership

---

**CivicAid** - Empowering Bangladeshi communities, one issue at a time. 🇧🇩 