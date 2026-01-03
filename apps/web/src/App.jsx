import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import StudentDashboard from './pages/StudentDashboard'
import LessonPlayer from './pages/LessonPlayer'
import TeacherDashboard from './pages/TeacherDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-main)',
          },
        }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/lesson/:lessonId" element={<LessonPlayer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
