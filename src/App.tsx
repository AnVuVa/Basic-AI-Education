/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LMS from './pages/LMS';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Community from './pages/Community';
import Lab from './pages/Lab';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="library" element={<Library />} />
            <Route path="community" element={<Community />} />
            <Route path="lab" element={<Lab />} />
          </Route>
          {/* LMS is outside Layout because it has its own full-screen layout */}
          <Route path="/learn/:id" element={<LMS />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
