import React, { useEffect, useState } from 'react'
import Close from './icons/Close.jsx'
import Button from './Button.jsx'
import Tick from './icons/Tick.jsx'

const SelectUserModal = props => {
  const [searchedText, setSearchedText] = useState('')
  const [users, setUsers] = useState([])
  const { onClose, onConfirm, allUsers, type, selectedUserId, selectUser } = props
  const searchedUsers = users.filter(user => user.username.includes(searchedText) && user.role === type)

  useEffect(() => {
    setUsers(allUsers)
  }, [])

  return (
    <div className='ltr bg-[rgba(0,0,0,0.7)] fixed top-0 left-0 right-0 bottom-0 z-10'>
      <div className='ltr bg-[#1d1c2b] absolute w-[360px] rounded-xl px-9 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
        <div className='ltr flex flex-row items-center justify-center pt-5 pb-5'>
          <Close className='ltr absolute top-5 right-5 cursor-pointer' onClick={onClose}/>
          <span className='text-gray-200'>{type === 'annotator' ? 'Choose Annotator' : 'Choose Reviewer'}</span>
        </div>
        <div className='ltr text-center pb-20'>
          <input
            type='text'
            className='ltr shadow appearance-none text-gray-200 border rounded w-full py-2 px-3 ext-gray-200  leading-tight bg-[#121119] focus:outline-none focus:shadow-outline'
            placeholder={type === 'annotator' ? 'Search Annotator Name' : 'Search Reviewer Name'}
            value={searchedText}
            onChange={e => setSearchedText(e.target.value)}
          />
          <div className='ltr h-[180px] mt-4 overflow-scroll overflow-x-hidden shadow appearance-none border rounded w-full px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'>
            {searchedUsers.map((user, index) => (
              <React.Fragment key={user.id}>
                <div
                  className='ltr flex justify-between cursor-pointer px-4'
                  onClick={() => selectUser(user)}
                >
                  <div className='ltr py-3 text-gray-400'>{user.username}</div>
                  {selectedUserId === user.id && <Tick className='ltr w-6 h-auto' />}
                </div>
                {(index < searchedUsers.length - 1) && <hr className='ltr' />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className='ltr absolute bottom-0 left-0 right-0 flex p-4 gap-4'>
          <Button className='ltr w-1/3 flex-1' title='Submit' disabled={!selectedUserId} type='secondary' onClick={onConfirm}/>
          <Button className='ltr w-1/3 flex-1' title='Cancel' onClick={onClose}/>
        </div>
      </div>
    </div>
  )
}

export default SelectUserModal
