import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // 追加
import App from './App.jsx'
import BookDetail from './BookDetail.jsx' // 追加
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/detail" element={<BookDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
