import React from 'react'
import Close from './icons/Close.jsx'
import Button from './Button.jsx'

const Modal = props => {
  const { onClose, onConfirm, onDiscard, desc, children, title, loading } = props

  return (
    <div className='bg-[rgba(0,0,0,0.7)] fixed top-0 left-0 right-0 bottom-0 z-20' onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className='bg-[#1d1c2b] absolute w-[360px] pb-24  rounded-xl p-9 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
        {
          title &&
        <h2 className='text-gray-200 text-center absolute left-0 right-0 top-2'>{title}</h2>
        }
        <Close className='absolute top-4 right-4 hover:cursor-pointer text-gray-200' onClick={onClose}/>
        {desc
          ? <p className='mt-4 text-center ltr text-gray-200'>{desc}</p>
          : children
        }
        <div className='absolute bottom-0 left-0 right-0 flex p-4 gap-4'>
          <Button loading={loading} className='w-1/3 flex-1' title='confirm' onClick={onConfirm}/>
          <Button className='w-1/3 flex-1' title='discard' type='secondary' onClick={onDiscard}/>
        </div>
      </div>
    </div>
  )
}

export default Modal
