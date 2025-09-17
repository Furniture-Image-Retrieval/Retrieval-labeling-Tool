import React from 'react'
import Close from './icons/Close.jsx'
import Button from './Button.jsx'

const InReviewModal = props => {
  const { onClose, onConfirm, type } = props

  return (
    <div className='ltr bg-[rgba(0,0,0,0.7)] fixed top-0 left-0 right-0 bottom-0 z-20' onClick={onClose}>
      <div className='ltr bg-white absolute w-[360px] h-[180px] rounded-xl px-9 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
        <div className='ltr flex flex-row items-center justify-center pt-5 pb-5'>
          <Close className='ltr absolute top-5 right-5 cursor-pointer' onClick={onClose}/>
          <span>{type === 'goForward' ? 'Complete Project' : 'Re-Annotate'}</span>
        </div>
        <p className='ltr text-center absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] whitespace-nowrap'>
          {type === 'goForward' ? 'Are you sure to complete the project?' : 'Are you sure to re-annotate the project?'}
        </p>
        <div className='ltr absolute bottom-0 left-0 right-0 flex p-4 gap-4'>
          <Button className='ltr w-1/3 flex-1' title='Confirm' type='secondary' onClick={onConfirm}/>
          <Button className='ltr w-1/3 flex-1' title='Cancel' onClick={onClose}/>
        </div>
      </div>
    </div>
  )
}

export default InReviewModal
