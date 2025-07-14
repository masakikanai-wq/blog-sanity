// web/src/main.tsx
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import PostDetail from './pages/post/PostDetail'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/post/:id" element={<PostDetail />} />
    </Routes>
  </BrowserRouter>
)
