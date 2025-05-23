import react from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Company from './pages/Company.jsx'
import Design from './pages/Design.jsx'   
import Bill from './pages/Bill.jsx'
import PreviewBill from './pages/PreviewBill.jsx'
     



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
<>

<BrowserRouter>
    <Routes>
      <Route path="/" element={ 
        <ProtectedRoute>
        <Home/>
      </ProtectedRoute>
      } />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<RegisterAndLogout/>} />
      <Route path="/Bill" element={<ProtectedRoute>
        {<Bill/>}
        </ProtectedRoute>
        } />
      <Route path="/PreviewBill" element={<ProtectedRoute>
        {<PreviewBill/>}
        </ProtectedRoute>
        } />
      <Route path="/logout" element={<ProtectedRoute>
        {<Logout/>}
        </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

    {/* <Company/> */}
    {/* <Design/> */}

        
        
</>
  )
}

export default App
