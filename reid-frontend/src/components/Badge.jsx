import React from 'react'

const Badge = props => {
  const { children, className = '' } = props

  return (
    <div className={`items-center py-2 px-4 text-base rounded-lg inline-block bg-gray-400 text-black ${className}`}>
      {children}
    </div>
  )
}

export default Badge
