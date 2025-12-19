import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import SignupChoice from './pages/SignupChoice'
import CookSignup from './pages/CookSignup'
import CustomerSignup from './pages/CustomerSignup'
import Profile from './pages/Profile'
import BrowseMeals from './pages/BrowseMeals'
import MealDetail from './pages/MealDetail'
import MyMeals from './pages/MyMeals'
import CreateMeal from './pages/CreateMeal'
import EditMeal from './pages/EditMeal'
import PlaceOrder from './pages/PlaceOrder'
import OrderHistory from './pages/OrderHistory'
import OrderDetail from './pages/OrderDetail'
import CookDashboard from './pages/CookDashboard'
import EnhancedCookDashboard from './pages/EnhancedCookDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignupChoice />} />
            <Route path="signup/cook" element={<CookSignup />} />
            <Route path="signup/customer" element={<CustomerSignup />} />
            
            <Route path="meals">
              <Route index element={<BrowseMeals />} />
              <Route path=":id" element={<MealDetail />} />
              <Route path="my-meals" element={
                <ProtectedRoute>
                  <MyMeals />
                </ProtectedRoute>
              } />
              <Route path="create" element={
                <ProtectedRoute>
                  <CreateMeal />
                </ProtectedRoute>
              } />
              <Route path="edit/:id" element={
                <ProtectedRoute>
                  <EditMeal />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="orders">
              <Route path="place/:mealId" element={
                <ProtectedRoute>
                  <PlaceOrder />
                </ProtectedRoute>
              } />
              <Route path="history" element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } />
              <Route path=":id" element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="dashboard" element={
              <ProtectedRoute>
                <EnhancedCookDashboard />
              </ProtectedRoute>
            } />

            <Route path="customer/dashboard" element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            } />

            <Route path="admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
