import React from 'react'
import { useUserInfoState } from '../context'
import Exit from './icons/Exit.jsx'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'

const Layout = props => {
  const { children } = props
  const userInfo = useUserInfoState()
  const { username, role } = userInfo

  return (
    <div className=''>
      <header className='h-16 z-10 bg-[#191724] fixed left-0 right-0 top-0 flex justify-between items-center px-6 text-white'>
        <div className='flex'>
          <div className='py-1 pl-3 border-l-[1px]'>
            {username} ({role})
          </div>
          <div className='flex gap-8 mr-5'>
            <Link to={'/'}>
               projects
            </Link>
            {
              role === 'admin' &&
            <Link to={'/users'}>
              users
            </Link>
            }
            <Link to={'/config'}>
               configs
            </Link>
          </div>
        </div>
        <span className='hover:cursor-pointer' onClick={() => {
          Cookies.remove('auth_token')
          window.location.replace('login')
        }}>
          <Exit/>
        </span>
      </header>
      <main className='mt-16'>
        {children}
      </main>
    </div>
  )
}

export default Layout
