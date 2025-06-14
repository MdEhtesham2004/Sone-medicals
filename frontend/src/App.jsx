import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Design from './pages/Design'; // Contains sidebar + <Outlet />
import Home from './pages/Home';
import Company from './pages/Company';
import Medicines from './pages/Medicines';
import Bill from './pages/Bill';
import PreviewBill from './pages/PreviewBill';
import Credit from './pages/Credit';
import CustomerDetails from './pages/CustomerDetails';
import Shortage from './pages/Shortage';
import Delivery from './pages/Delivery';


function Logout() {
  localStorage.clear();
  alert("Logged out successfully");
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />

        {/* Protected Routes with sidebar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Design /> 
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="company" element={<Company />} />
          <Route path="medicines" element={<Medicines />} />
          <Route path="bill" element={<Bill />} />
          <Route path="preview" element={<PreviewBill />} />
          <Route path="credit" element={<Credit />} />
          <Route path="credit/:id" element={<CustomerDetails />} />
          <Route path='shortage' element={<Shortage/>} />
          <Route path='delivery' element={<Delivery/>} />
          <Route path="logout" element={<Logout />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



