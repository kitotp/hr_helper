import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import AdminLoginForm from './pages/AdminLoginPage'
import AdminPage from './pages/AdminPage'
import { AdminProvider } from './context/AdminContext'
import RedirectIfAdmin from './components/RedirectIfAdmin'
import RedirectIfNotLogined from './components/RedirectIfNotLogined'
import FormPage from './pages/FormPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <FormPage />
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
