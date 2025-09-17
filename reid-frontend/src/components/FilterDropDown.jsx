import React, { useState } from 'react'

export default function FilterDropDown (props) {
  const {
    items = [],
    changeHandler,
    title,
  } = props

  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  const onChange = value => {
    changeHandler(value)
    toggle()
  }

  if (!items || items.length === 0) return null

  return (
    <>
      <div className='ltr text-white relative text-center'>
        <div className='ltr bg-slate-600 rounded py-1 w-40 cursor-pointer' onClick={toggle}>
          {title}
        </div>
        {isOpen &&
          <div
            className='ltr absolute bg-slate-600 rounded z-10 left-0 top-0 w-40'
            tabIndex='0'
          >
            <div className='ltr'>
              {items.map((item, index) => {
                return (
                  <>
                    <span
                      className='ltr block py-1 cursor-pointer'
                      key={index}
                      onClick={() => onChange(item)}
                    >
                      {item}
                    </span>
                    {(index !== items.length - 1) &&
                        <hr className='w-3/4 text-center mx-auto opacity-25' />
                    }
                  </>
                )
              })}
            </div>
          </div>
        }
      </div>
      {isOpen &&
        <div
          onClick={() => setIsOpen(false)}
          className='fixed top-0 left-0 w-full h-full'
        />
      }
    </>
  )
}
