import React, { useEffect, useState } from 'react'
import Button from '../components/Button.jsx'
import Toast from '../components/Toast.jsx'
import { setSelfReidConfig, getSelfReidConfig, setNextInProgressCheckedConfig, getNextInProgressCheckedConfig } from '../context/config.js'

const ConfigPage = () => {
  const [showToast, setShowToast] = useState(false)
  const [selfReidchecked, setSelfReidchecked] = React.useState(getSelfReidConfig());
  const [nextInProgressChecked, setNextInProgressChecked] = React.useState(getNextInProgressCheckedConfig());

  const changeHandler = (e, field) => {
    if (field === 'selfReid') {
      setSelfReidchecked(!selfReidchecked)
    }
    if (field === 'nextInProgress') {
      setNextInProgressChecked(!nextInProgressChecked)
    }
  }

  return (
    <div className='flex justify-center items-center h-screen relative'>
      <div className='w-2/5 min-w-[400px] border-solid border-2 border-gray-500 rounded-md px-20 py-10 bg-[#191724] shadow-lg'>
        <div className='text-center text-2xl'>
          <span className='text-gray-200'>Configs</span>
        </div>
        <form className='pt-4'>
          <div className='ltr flex items-center justify-between' >
            <label className='ltr text-gray-200 '>Self Reid</label>
            <input
              className={`ltr shadow bg-[#121119] border rounded py-3 px-3 text-gray-200 leading-tight  focus:outline-none }`}
              style={{scale: '1.5'}}            
              type='checkbox'
              checked={selfReidchecked}
              onChange={e => changeHandler(e, 'selfReid')}
            />
          </div>
          <div className='ltr flex items-center justify-between' >
            <label className='ltr text-gray-200 '>Next In Progress</label>
            <input
              className={`ltr shadow bg-[#121119] border rounded py-3 px-3 text-gray-200 leading-tight  focus:outline-none }`}
              style={{scale: '1.5'}}            
              type='checkbox'
              checked={nextInProgressChecked}
              onChange={e => changeHandler(e, 'nextInProgress')}
            />
          </div>
          <br/>
          <div className='flex justify-center mt-4'>
            <Button
              type='primary'
              onClick={(e) => {
                e.preventDefault()  
                setShowToast(true)
                setSelfReidConfig(selfReidchecked)
                setNextInProgressCheckedConfig(nextInProgressChecked)
              }}
            >
              save
            </Button>
          </div>
        </form>
      </div>
      <Toast
        type='success'
        showToast={showToast}
        setShowToast={setShowToast}
        toastMsg={"config saved"}
      />
    </div>
  )
}

export default ConfigPage
