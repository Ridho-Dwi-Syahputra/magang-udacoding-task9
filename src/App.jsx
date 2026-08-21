import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Items from './pages/Items'
import Categories from './pages/Categories'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Semua yang di dalam sini butuh token. PrivateRoute dipasang sekali
              di route induknya, jadi nggak perlu dibungkus per halaman. */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/items" element={<Items />} />
            <Route path="/categories" element={<Categories />} />
          </Route>

          <Route path="*" element={<Navigate to="/items" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
