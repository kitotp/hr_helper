import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import AdminLoginForm from './AdminLoginForm'
import AdminPage from './AdminPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/admin',
    element: <AdminLoginForm />
  },
  {
    path: '/admin/dashboard',
    element: <AdminPage />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
