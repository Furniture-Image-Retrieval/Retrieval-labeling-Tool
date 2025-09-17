import React, { useEffect } from 'react'
import { useAuthState, useUserInfoDispatch, useUserInfoState } from '../context/index'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import { useNavigate } from 'react-router-dom'
import getUserInfo from '../services/getUserInfo'
import Layout from './Layout.jsx'

const AuthGuard = ({ component, restrictedRoles = [] }) => {
  const authState = useAuthState()
  const userInfo = useUserInfoState()
  const navigate = useNavigate()
  const userInfoDispatch = useUserInfoDispatch()
  useEffect(() => {
    if (authState === 'loggedIn') {
      getUserInfo().then(res => {
        userInfoDispatch({ type: 'set', payload: res })
      })
    }
    // userInfoDispatch({ type: 'set', payload: userInfo })
  }, [])

  if (restrictedRoles.includes(userInfo?.role)) return <NotFoundPage />

  if (authState === 'loggedIn') {
    return (
      <Layout>
        {component}
      </Layout>
    )
  } else if (authState === 'loggedOut') {
    navigate('login')
    // redirect to login page
    // window.location.replace('login page')
  } else {
    // show loading
    // <Loading />
  }
}

export default AuthGuard
