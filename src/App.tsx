/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LMS from './pages/LMS';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Community from './pages/Community';
import Lab from './pages/Lab';
import AIAccounts from './pages/AIAccounts';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Home has its own full-screen layout (no top navbar) */}
          <Route path="/" element={<Home />} />
          <Route path="/" element={<Layout />}>
            <Route path="about" element={<About />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="library" element={<Library />} />
            <Route path="community" element={<Community />} />
            <Route path="lab" element={<Lab />} />
          <Route path="ai-accounts" element={<AIAccounts />} />
          </Route>
          {/* LMS is outside Layout because it has its own full-screen layout */}
          <Route path="/learn/:id" element={<LMS />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}
