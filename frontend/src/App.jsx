import ComplaintsList from './pages/ComplaintsList';

<Route path="/admin/complaints" element={<ComplaintsList />} />
import AdminDashboard from './pages/AdminDashboard';

<Route path="/admin" element={<AdminDashboard />} />

// App.jsx
import ManageUsers from './pages/ManageUsers';

// Inside your <Routes>
<Route path="/admin/users" element={<ManageUsers />} />
