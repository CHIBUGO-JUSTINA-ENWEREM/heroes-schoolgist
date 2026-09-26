 import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import StudentHome from './pages/StudentHome';
import AskTeacher from './pages/AskTeacher';
import Guidance from './pages/Guidance';
import Practice from './pages/Practice';
import Quiz from './pages/Quiz';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddQuestion from './pages/AddQuestion';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student-dashboard" element={<StudentHome />} />
      <Route path="/ask-teacher" element={<AskTeacher />} />
      <Route path="/guidance" element={<Guidance />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-question" element={<AddQuestion />} />
    </Routes>
  );
}

export default App;