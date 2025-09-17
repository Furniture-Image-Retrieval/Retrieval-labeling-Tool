import React, { useEffect, useState } from 'react'
import Toast from '../components/Toast.jsx'
import Button from '../components/Button.jsx'
import removeUser from '../services/removeUser.js'
import addUser from '../services/addUser.js'
import CreateUserModal from '../components/CreateUserModal.jsx'
import Trash from '../components/icons/Trash.jsx'
import getUsers from '../services/getUsers.js'
import Modal from '../components/Modal.jsx'

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [view, setView] = useState('normal')
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState(false)
  const [toastType, setToastType] = useState('success')
  const [isDataFetched, setIsDataFetched] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState()
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)

    getUsers().then(res => {
      setUsers(prev => [...prev, ...res])
    }).finally(() => {
      setIsDataFetched(true)
    })
  }, [])

  const checkUsersHaveCurrentProject = (user) => {
    if (!user.currentProjects) {
      return false
    }

    setToastMsg(`user ${user.username} has ongoing projects`)
    setToastType('danger')
    setShowToast(true)

    return true
  }

  const deleteUser = (user) => {
    if (checkUsersHaveCurrentProject(user)) return

    const { username } = user
    removeUser(username).then(res => {
      if (res && res.succeeded) {
        setUsers(users.filter(i => i.username !== username))
        setToastMsg('user removed successfully')
        setToastType('success')
        setShowToast(true)
        // setView('normal')
      } else {
        setToastMsg(res.errorMessage)
        setToastType('danger')
        setShowToast(true)
      }
    })
  }

  const createUser = ({ username, password, role }) => {
    setModalLoading(true)
    addUser({ username, role, password }).then(res => {
      setModalLoading(false)
      setShowToast(true)
      if (res && res.succeeded) {
        setToastMsg('user added successfully')
        setToastType('success')
        setUsers([...users, { username, role }])
        setView('normal')
      } else {
        setToastMsg(res.errorMessage)
        setToastType('danger')
      }
    })
  }

  return (
    <div className='relative'>
      <div className='px-20 py-6'>
        <div className='w-full'>
          {view === 'normal' && (
            <div className='flex'>
              <Button className='ml-4 pd-1' onClick={() => setView('addUser')}>add user</Button>
              <Button className='pd-1' onClick={() => setView('removeUser')}>remove users</Button>
            </div>
          )}
          {view === 'removeUser' && (
            <>
              <Button onClick={() => setView('normal')}>cancel</Button>
            </>
          )}
        </div>
        <div className='w-full py-10 text-xl'>
          {isDataFetched
            ? (
              users.length
                ? (
                  <>
                    <div className='flex items-center rounded border-solid border-2 border-gray-400 bg-[#121119] text-gray-200 py-0 px-6 h-14'>
                      {view === 'removeUser' && (
                        <div className='w-4 h-4'></div>
                      )}
                      <div className='w-1/3 text-center font-bold'>username</div>
                      <div className='w-1/3 text-center font-bold'>role</div>
                      <div className='w-1/3 text-center font-bold'>Number of delivered projects</div>
                    </div>
                    {users.filter(user => user.role !== 'admin').map((user) => (
                      <div key={user.username} className='flex items-center w-full rounded border-solid border-2 border-gray-400 bg-[#191724] text-gray-200 py-0 px-6 h-14 mt-3'>
                        {view === 'removeUser' && (
                          <span className='transition-colors hover:cursor-pointer hover:bg-[#2c1618] p-2 rounded-full' onClick={() => {
                            setIsConfirmModalOpen(true)
                            setDeletingUser(user)
                          }}>
                            <Trash className='text-[#d56562]'/>
                          </span>
                        )}
                        <div className='w-1/3 text-center'>{user.username}</div>
                        <div className='w-1/3 text-center'>{user.role}</div>
                        <div className='w-1/3 text-center'>{user.doneProjects || 0}</div>
                      </div>
                    ))}
                    {view === 'addUser' && (
                      <CreateUserModal loading={modalLoading} onClose={() => setView('normal')} onConfirm={createUser}/>
                    )}
                  </>
                )
                : (
                  <div className='relative ltr'>
                    <div className='px-20 py-24 text-center'>
                      <img className='w-36 mx-auto' src='./assets/images/empty-box.png'/>
                      <div className='w-full py-10 text-xl'>
                        <p className='ltr text-center text-white'>{'No users found!'}</p>
                      </div>
                    </div>
                  </div>
                )
            )
            : (
              <div role='status' className='flex items-center justify-center w-full h-full'>
                <svg aria-hidden='true' className='w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-gray-300' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor'/>
                  <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill'/>
                </svg>
              </div>
            )
          }
        </div>
      </div>
      <Toast
        type={toastType}
        showToast={showToast}
        setShowToast={setShowToast}
        toastMsg={toastMsg}
      />
      {
        isConfirmModalOpen &&
        <Modal
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() => {
            deleteUser(deletingUser)
            setDeletingUser(null)
            setIsConfirmModalOpen(false)
          }}
          desc={`are you sure about removing '${deletingUser.username}'?`}
        />
      }
    </div>
  )
}

export default UsersPage
