import React, { createContext, useContext, useEffect, useReducer } from 'react'
import Cookies from 'js-cookie'
import {
  authReducer,
  authState,
  userInfoReducer,
  userInfoState,
} from './reducer'

const UserInfoStateContext = createContext()
const UserInfoDispatchContext = createContext()

export function useUserInfoState () {
  const context = useContext(UserInfoStateContext)

  return context
}

export function useUserInfoDispatch () {
  const context = useContext(UserInfoDispatchContext)

  return context
}

export const UserInfoProvider = ({ children }) => {
  const [userInfo, dispatch] = useReducer(userInfoReducer, userInfoState)

  return (
    <UserInfoStateContext.Provider value={userInfo}>
      <UserInfoDispatchContext.Provider value={dispatch}>
        {children}
      </UserInfoDispatchContext.Provider>
    </UserInfoStateContext.Provider>
  )
}

const AuthStateContext = createContext()
const AuthDispatchContext = createContext()

export function useAuthState () {
  const context = useContext(AuthStateContext)

  return context
}

export function useAuthDispatch () {
  const context = useContext(AuthDispatchContext)

  return context
}

export const AuthProvider = ({ children }) => {
  const [authStatus, dispatch] = useReducer(authReducer, authState)

  useEffect(() => {
    const authToken = Cookies.get('auth_token')

    if (authToken) {
      dispatch({ type: 'login' })
    } else {
      dispatch({ type: 'logout' })
    }
  }, [])

  return (
    <AuthStateContext.Provider value={authStatus}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}
