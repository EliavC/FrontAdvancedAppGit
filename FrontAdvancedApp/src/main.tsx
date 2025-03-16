import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './componnents/App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='1095994315651-m1c1vfi8q5060nthnrnal8saehp5hnn8.apps.googleusercontent.com'>
    <StrictMode>
      <App />
    </StrictMode>,
  </GoogleOAuthProvider>
)
