import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthGuard from './components/AuthGuard.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import ComparePage from './pages/ComparePage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ConfigPage  from './pages/ConfigPage.jsx'

const App = () => {
  return (
    <Routes>
      <Route index path='/' element={<AuthGuard component={<ProjectsPage />}/>} />
      <Route path='login' element={<LoginPage />} />
      <Route path='project/:name' element={<AuthGuard component={ <ProjectPage />}/>} />
      <Route path='users' element={<AuthGuard component={<UsersPage />} restrictedRoles={['reviewer', 'annotator']}/>} />
      <Route path='compare' element={<AuthGuard component={<ComparePage />}/>}/>
      <Route path='config' element={<AuthGuard component={<ConfigPage />}/>}/>
      <Route path='not-found' element={<AuthGuard component={<NotFoundPage />} />} />
      <Route path='*' element={<Navigate to={'not-found'} />} />
    </Routes>
  )
}

export default App
