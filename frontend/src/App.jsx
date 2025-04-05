import react from 'react'
import { BrowserRouter ,Routes,Route,Navigate} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'


function logout(){
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterandLogout(){
  localStorage.clear()
  return <Register/>
}

function App() {
  
  return (
    
    <BrowserRouter>
    <Routes>
      <Route path="/" element={ <ProtectedRoute>
        <Home/>
      </ProtectedRoute>
      } />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<RegisterandLogout/>} />
      <Route path="/logout" element={<ProtectedRoute>
        {logout()}
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound/>} />
    </Routes>
    </BrowserRouter>
    

  )
}

export default App
