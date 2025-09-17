import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = (props) => {
  const navigate = useNavigate()

  return (
    <div className='NotFoundContainer'>
      <span className='text text-gray-300'>Page not found</span>
      <button className='btn' onClick={() => navigate('/')}>back to home Page</button>
    </div>
  )
}

export default NotFoundPage
