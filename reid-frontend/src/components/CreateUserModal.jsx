import React, { useState } from 'react'
import Modal from './Modal.jsx'
import { roles } from '../constants/usersMockData.js'
import Dropdown from './Dropdown.jsx'

const CreateUserModal = props => {
  const { onClose, onConfirm, loading } = props
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [usernameError, setUsernameError] = useState()
  const [passwordError, setPasswordError] = useState()

  const [role, setRole] = useState('reviewer')

  return (
    <Modal title='Create New User' loading={loading} onClose={onClose} onConfirm={() => {
      setUsernameError(false)
      setPasswordError(false)
      if (!username) {
        setUsernameError(true)
      }
      if (!password) {
        setPasswordError(true)
      }
      if (password && username) {
        onConfirm({ username, password, role })
      }
    }}>
      <>
        <div>
          <label className='ltr block mt-4 text-gray-200 text-lg mb-2'>Username</label>
          <input
            className={`ltr shadow bg-[#121119] appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline ${usernameError ? 'border-red-800' : ''}`}
            type='text'
            // placeholder='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
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
              type={'text'}
              // placeholder='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {
              passwordError && <span className='text-red-800 text-sm text-left w-full inline-block'>enter password</span>
            }
          </div>
        </div>
        <div>
          <label className='ltr block mt-4 text-gray-200 text-lg mb-2'>Role</label>
          <Dropdown val={role} setVal={setRole} items={roles}/>
        </div>
      </>
    </Modal>
  )
}

export default CreateUserModal
