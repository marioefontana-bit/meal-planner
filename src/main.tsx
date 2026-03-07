import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <App />
    </React.Suspense>
  </StrictMode>,
)
