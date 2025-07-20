import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { RideProvider } from './context/RideContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RideProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RideProvider>
  </StrictMode>,
)
