import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import AboutPage from './pages/AboutPage'
import CourseOverview from './pages/CourseOverview'
import CourseViewer from './pages/CourseViewer'
import QuizPage from './pages/QuizPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/auth" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseSlug"
        element={
          <ProtectedRoute>
            <CourseOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseSlug/topics/:topicSlug"
        element={
          <ProtectedRoute>
            <CourseViewer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseSlug/quizzes/:quizId"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
