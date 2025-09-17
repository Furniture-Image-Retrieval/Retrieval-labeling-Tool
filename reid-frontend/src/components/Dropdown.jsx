import React, { useState } from 'react'

export default function Dropdown (props) {
  const { items, setVal, val } = props
  const [open, setOpen] = useState(false)

  return (
    <div onClick={() => {
      setOpen(p => !p)
    }} className='inline-flex hover:cursor-pointer bg-[#121119] justify-between border rounded-md ltr w-36' style={{ direction: 'ltr' }}>
      <div
        className='px-4 py-2 text-sm text-gray-300 hover:text-gray-700rounded-l-md'
      >
        {val}
      </div>

      <div className='relative'>
        <button
          type='button'
          className='inline-flex items-center justify-center h-full px-2 text-gray-300 hover:text-gray-700 rounded-r-md'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-4 h-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </button>
        {
          open &&
          <div className='absolute right-0 z-10 w-56 mt-4 origin-top-right bg-[#121119] rounded-md shadow-lg'>
            <div className='p-2'>
              {
                items?.filter(i => i.title !== 'admin').map(i => (
                  <div key={i.title} onClick={() => setVal(i.title)} className='block px-4 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-50 hover:cursor-pointer hover:text-gray-700'>
                    {i.title}
                  </div>
                ))}
            </div>
          </div>
        }
      </div>
    </div>
  )
}
