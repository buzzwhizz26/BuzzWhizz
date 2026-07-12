import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { NewsProvider } from './context/NewsContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <NewsProvider>
        <App />
      </NewsProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
