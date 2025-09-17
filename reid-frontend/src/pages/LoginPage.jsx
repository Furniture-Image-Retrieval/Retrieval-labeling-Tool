import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
// import Lottie from 'react-lottie'
// import moreLottie from './moreLottie.json'
import HidePassword from '../components/icons/HidePassword.jsx'
import ShowPassword from '../components/icons/ShowPassword.jsx'
import Button from '../components/Button.jsx'
import Toast from '../components/Toast.jsx'
import { useAuthDispatch, useAuthState, useUserInfoDispatch, useUserInfoState } from '../context/index'
import login from '../services/login.js'
import getUserInfo from '../services/getUserInfo.js'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isBtnDisabled, setIsBtnDisabled] = useState(true)
  const [isBtnLoading, setIsBtnLoading] = useState(false)
  const [isRememeberMeChecked, setIsRememeberMeChecked] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  const [usernameError, setUsernameError] = useState()
  const [passwordError, setPasswordError] = useState()
  const authState = useAuthState()
  const authDispatch = useAuthDispatch()
  const userInfoDispatch = useUserInfoDispatch()
  const userInfo = useUserInfoState()
  const navigate = useNavigate()

  useEffect(() => {
    const loginCredentials = Cookies.get('login-credentials')

    if (loginCredentials) {
      setIsRememeberMeChecked(true)
      const { username, password } = decryptUserCredentials(loginCredentials)
      setUsername(username)
      setPassword(password)
    }
  }, [])

  const changeHandler = (e, field) => {
    if (field === 'username') {
      setUsername(e.target.value)

      if (password) {
        setIsBtnDisabled(false)
      }
    } else if (field === 'password') {
      setPassword(e.target.value)

      if (username) {
        setIsBtnDisabled(false)
      }
    }

    if (!e.target.value) {
      setIsBtnDisabled(true)
    }
  }

  const encryptUserCredentials = userCredentials => {
    return btoa(JSON.stringify(userCredentials))
  }

  const decryptUserCredentials = userCredentials => {
    return JSON.parse(atob(userCredentials))
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (isBtnLoading) return

    setIsBtnLoading(true)

    const res = await login({ username, password })

    if (res.succeeded) {
      if (isRememeberMeChecked) {
        Cookies.set('login-credentials', encryptUserCredentials({ username, password }))
      } else {
        Cookies.remove('login-credentials')
      }

      authDispatch({ type: 'login' })

      navigate('/')
    } else {
      setToastMsg(res.errorMessage)
      setShowToast(true)
    }

    setIsBtnLoading(false)
  }

  if (authState === 'loggedIn') navigate('/')

  return (
    <div className='flex justify-center items-center h-screen relative'>
      <div className='w-2/5 min-w-[400px] border-solid border-2 border-gray-500 rounded-md px-20 py-10 bg-[#191724] shadow-lg'>
        <div className='text-center text-2xl'>
          <span className='text-gray-200'>Login</span>
        </div>
        <form className='pt-4' onSubmit={handleLogin}>
          <div>
            <label className='ltr block mt-4 text-gray-200 text-lg mb-2'>Username</label>
            <input
              className={`ltr shadow bg-[#121119] appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline ${usernameError ? 'border-red-800' : ''}`}
              type='text'
              value={username}
              onChange={e => changeHandler(e, 'username')}
            />
            {
              usernameError && <span className='text-red-800 text-sm text-left w-full inline-block'>enter username</span>
            }
          </div>
          <div>
            <label className='ltr block mt-4 text-gray-200 text-lg mb-2'>Password</label>
            <div className='relative'>
              <input
                className={`ltr shadow bg-[#121119] appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline ${passwordError ? 'border-red-800' : ''}`}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => changeHandler(e, 'password')}
              />
              <span className='cursor-pointer absolute right-2 bottom-0 top-0 flex items-center' onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <ShowPassword className='w-6 h-6'/> : <HidePassword className='w-6 h-6' />}
              </span>
            </div>
            {
              passwordError && <span className='text-red-800 text-sm text-left w-full inline-block'>enter password</span>
            }
          </div>
          <div className='flex items-center justify-end mt-4'>
            <label htmlFor='example1' className='text-sm font-medium text-gray-400'>remember me</label>
            <input
              className='cursor-pointer mr-2 h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400'
              type='checkbox'
              id='rememeberMe'
              value={isRememeberMeChecked}
              onChange={e => setIsRememeberMeChecked(e.target.checked)}
            />
          </div>
          <div className='flex justify-center mt-4'>
            <Button
              type='primary'
              onClick={(e) => {
                setUsernameError(false)
                setPasswordError(false)
                if (!username) {
                  setUsernameError(true)
                }
                if (!password) {
                  setPasswordError(true)
                }
                if (password && username) {
                  handleLogin(e)
                }
              }}
              loading={isBtnLoading}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
      <Toast
        type='danger'
        showToast={showToast}
        setShowToast={setShowToast}
        toastMsg={toastMsg}
      />
    </div>
  )
}

export default LoginPage
