import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import AdminLoginForm from './components/AdminLoginForm'
import AdminPage from './AdminPage'
import { AdminProvider } from './context/AdminContext'
import RedirectIfAdmin from './components/RedirectIfAdmin'
import RedirectIfNotLogined from './components/RedirectIfNotLogined'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/admin',
    element: (
      <RedirectIfAdmin>
        <AdminLoginForm />
      </RedirectIfAdmin>
    )
  },
  {
    path: '/admin/dashboard',
    element: 
    <RedirectIfNotLogined>
      <AdminPage />
    </RedirectIfNotLogined>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminProvider>
      <RouterProvider router={router} />
    </AdminProvider>
  </StrictMode>,
)
