import React, { useEffect } from 'react'

const settings = {
  success: { bgColor: 'bg-green-600' },
  danger: { bgColor: 'bg-red-500' },
  warning: { bgColor: 'bg-yellow-500' },
}

const Toast = (props) => {
  const { type = 'success', showToast, setShowToast, toastMsg } = props
  const bgColor = settings[type].bgColor

  useEffect(() => {
    if (!showToast) return

    setTimeout(() => setShowToast(false), 3000)
  }, [showToast])

  if (!showToast) return

  return (
    <div className={`ltr animate-fadeOut absolute flex items-center w-full max-w-xs p-4 mb-4 text-white ${bgColor} rounded-lg shadow top-10 mx-auto left-0 right-0 z-20`} role='alert'>
      <div className='ltr text-md font-normal mx-auto'>{toastMsg}</div>
    </div>
  )
}

export default Toast
