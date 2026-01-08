import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// 🔥 Terapkan global theme sebelum render
document.body.classList.add(
  "bg-app-bg",
  "text-light-text",
  "dark:bg-dark-bg",
  "dark:text-dark-text"
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
