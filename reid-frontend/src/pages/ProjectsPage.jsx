import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
import getProjects from '../services/getProjects.js'
import assignProject from '../services/assignProject.js'
import More from '../components/icons/More.jsx'
import ArchiveModal from '../components/ArchiveModal.jsx'
import InReviewModal from '../components/InReviewModal.jsx'
import SelectUserModal from '../components/SelectUserModal.jsx'
import MoreMenu from '../components/MoreMenu.jsx'
import { useUserInfoState } from '../context/index.js'
import getUsers from '../services/getUsers.js'
import changeProjectStatus from '../services/changeProjectStatus.js'
import FilterDropDown from '../components/FilterDropDown.jsx'

const filterTypes = [
  'all',
  'to do',
  'in annotation',
  'req to review',
  'in review',
  'done',
  'archive',
]

const projectColors = {
  'to do': {
    backgroundColor: '#7dd3fc',
    color: '#003366',
  },
  'in annotation': {
    backgroundColor: '#facc15',
    color: '#333333',
  },
  'req to review': {
    backgroundColor: '#6d28d9',
    color: '#ffffff',
  },
  'in review': {
    backgroundColor: '#facc15',
    color: '#333333',
  },
  done: {
    backgroundColor: '#14532d',
    color: '#ffffff',
  },
  archive: {
    backgroundColor: '#475569',
    color: '#ffffff',
  },
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState(false)
  const [toastType, setToastType] = useState('success')
  const [isDataFetched, setIsDataFetched] = useState(false)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)
  const [isInReviewModalOpen, setIsInReviewModalOpen] = useState(false)
  const [inReviewModalType, setInReviewModalType] = useState(false)
  const [selectUserModalType, setSelectUserModalType] = useState(false)
  const [isSelectUserModalOpen, setIsSelectUserModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const userInfo = useUserInfoState()
  const { role } = userInfo
  const navigate = useNavigate()
  const filteredProjects = filterType !== 'all'
    ? projects.filter(project => project.status === filterType)
    : projects

  useEffect(() => {
    window.scrollTo(0, 0)

    if (!isDataFetched) {
      getProjects().then(res => {
        setProjects(sortProjects(res))
        setIsDataFetched(true)
      })
      getUsers().then(res => setUsers(res))
    }
  }, [])

  const sortProjects = (projects) => {
    const todos = projects.filter(project => project.status === 'to do')
    const inAnnotations = projects.filter(project => project.status === 'in annotation')
    const reqToReviews = projects.filter(project => project.status === 'req to review')
    const inReviews = projects.filter(project => project.status === 'in review')
    const dones = projects.filter(project => project.status === 'done')
    const archives = projects.filter(project => project.status === 'archive')

    return [
      ...todos,
      ...inAnnotations,
      ...reqToReviews,
      ...inReviews,
      ...dones,
      ...archives,
    ]
  }

  const changeStatus = (type, project) => {
    const { status, id } = selectedProject || project
    const updatedProjects = [...projects]
    const projectToChange = updatedProjects.find(project => project.id === id)

    if (status === 'done' || type === 'makeArchive') {
      changeProjectStatus({
        project_name: selectedProject.name,
        new_status: 'archive',
      }).then(res => {
        if (res && res.succeeded) {
          projectToChange.status = 'archive'

          setProjects(sortProjects(updatedProjects))
          setIsArchiveModalOpen(false)
          setToastMsg('Successfully Changed!')
          setToastType('success')
          setShowToast(true)
        } else {
          setToastMsg(res.errorMessage)
          setToastType('danger')
          setShowToast(true)
        }
      })
    } else if (status === 'in review') {
      if (inReviewModalType === 'goForward') {
        changeProjectStatus({
          project_name: selectedProject?.name || project.name,
          new_status: 'done',
        }).then(res => {
          if (res && res.succeeded) {
            projectToChange.status = 'done'

            setProjects(sortProjects(updatedProjects))
            setIsInReviewModalOpen(false)
            setToastMsg('Successfully Changed!')
            setToastType('success')
            setShowToast(true)
          } else {
            setToastMsg(res.errorMessage)
            setToastType('danger')
            setShowToast(true)
          }
        })
      } else {
        changeProjectStatus({
          project_name: selectedProject?.name || project.name,
          new_status: 'in annotation',
        }).then(res => {
          if (res && res.succeeded) {
            projectToChange.status = 'in annotation'

            setProjects(sortProjects(updatedProjects))
            setIsInReviewModalOpen(false)
            setToastMsg('Successfully Changed!')
            setToastType('success')
            setShowToast(true)
          } else {
            setToastMsg(res.errorMessage)
            setToastType('danger')
            setShowToast(true)
          }
        })
      }
    } else if (status === 'to do') {
      assignProject({
        project_name: selectedProject.name,
        username: selectedUser.username,
        role: selectedUser.role,
      }).then(res => {
        if (res && res.succeeded) {
          projectToChange.annotator = selectedUser.username
          projectToChange.status = 'in annotation'

          setProjects(sortProjects(updatedProjects))
          setIsSelectUserModalOpen(false)
          setToastMsg('Successfully Changed!')
          setToastType('success')
          setShowToast(true)
        } else {
          setToastMsg(res.errorMessage)
          setToastType('danger')
          setShowToast(true)
        }
      })
    } else if (status === 'req to review') {
      assignProject({
        project_name: selectedProject.name,
        username: selectedUser.username,
        role: selectedUser.role,
      }).then(res => {
        if (res && res.succeeded) {
          projectToChange.reviewer = selectedUser.username
          projectToChange.status = 'in review'

          setProjects(sortProjects(updatedProjects))
          setIsSelectUserModalOpen(false)
          setToastMsg('Successfully Changed!')
          setToastType('success')
          setShowToast(true)
        } else {
          setToastMsg(res.errorMessage)
          setToastType('danger')
          setShowToast(true)
        }
      })
    } else if (status === 'archive') {
      changeProjectStatus({
        project_name: selectedProject?.name || project.name,
        new_status: 'to do',
      }).then(res => {
        if (res && res.succeeded) {
          projectToChange.status = 'to do'
          projectToChange.reviewer = 'None'
          projectToChange.annotator = 'None'

          setProjects(sortProjects(updatedProjects))
          setToastMsg('Successfully Changed!')
          setToastType('success')
          setShowToast(true)
        } else {
          setToastMsg(res.errorMessage)
          setToastType('danger')
          setShowToast(true)
        }
      })
    } else if (status === 'in annotation') {
      changeProjectStatus({
        project_name: selectedProject?.name || project.name,
        new_status: 'req to review',
      }).then(res => {
        if (res && res.succeeded) {
          projectToChange.status = 'req to review'

          setProjects(sortProjects(updatedProjects))
          setToastMsg('Successfully Changed!')
          setToastType('success')
          setShowToast(true)
        } else {
          setToastMsg(res.errorMessage)
          setToastType('danger')
          setShowToast(true)
        }
      })
    }

    setSelectedProject(null)
  }

  const selectProject = (project, type) => {
    setIsMoreMenuOpen(false)
    const { status } = project
    setSelectedProject(project)

    if (status === 'done' || type === 'makeArchive') {
      setIsArchiveModalOpen(true)
    } else if (status === 'in review') {
      setInReviewModalType(type)
      setIsInReviewModalOpen(true)
    } else if (status === 'to do') {
      setSelectUserModalType('annotator')
      setIsSelectUserModalOpen(true)
    } else if (status === 'req to review') {
      setSelectUserModalType('reviewer')
      setIsSelectUserModalOpen(true)
    } else if (status === 'archive') {
      changeStatus('', project)
    } else if (status === 'in annotation') {
      changeStatus('', project)
    }
  }

  const goToProject = (projectName) => navigate(`/project/${projectName}`)

  const selectUser = (user) => {
    if (selectedUser && (selectedUser.id === user.id)) {
      setSelectedUser(null)
    } else {
      setSelectedUser(user)
    }
  }

  const closeSelectUserModal = () => {
    setSelectedUser(null)
    setIsSelectUserModalOpen(false)
  }

  const toggleMoreMenu = (projectId) => {
    setSelectedProjectId(projectId)
    setIsMoreMenuOpen(true)
  }

  if (!isDataFetched) {
    return (
      <div role='status' className='flex mt-36 items-center justify-center w-full h-full'>
        <svg aria-hidden='true' className='w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-gray-300' viewBox='0 0 100 101' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z' fill='currentColor'/>
          <path d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z' fill='currentFill'/>
        </svg>
      </div>
    )
  }

  if (isDataFetched && projects.length === 0) {
    return (
      <div className='relative ltr'>
        <div className='px-20 py-24 text-center'>
          <img className='w-36 mx-auto' src='./assets/images/empty-box.png'/>
          <div className='w-full py-10 text-xl'>
            <p className='ltr text-center text-white'>{"You don't have any projects!"}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='ltr relative ltr'>
      <div className='ltr px-20 py-6'>
        <FilterDropDown
          title={filterType}
          items={filterTypes}
          changeHandler={setFilterType}
        />
        <div className='ltr w-full py-10 text-xl'>
          <div className='ltr flex items-center rounded border-solid border-2 border-gray-400 bg-[#121119] text-gray-200 py-0 px-6 h-14 text-md'>
            <div className='w-1/6 text-center font-extrabold text-lg'>Project Name</div>
            <div className='w-1/6 text-center font-extrabold text-lg'>Status</div>
            <div className='w-1/6 text-center font-extrabold text-lg'>IDs</div>
            <div className='w-1/6 text-center font-extrabold text-lg'>Annotator</div>
            <div className='w-1/6 text-center font-extrabold text-lg'>Reviewer</div>
          </div>
          {filteredProjects.map(project => (
            <div
              key={project.id}
              style={{
                backgroundColor: projectColors[project.status].backgroundColor,
                color: projectColors[project.status].color,
              }}
              className={`ltr flex items-center w-full rounded border-solid border-2 border-gray-400 py-0 px-6 h-14 mt-3 text-md`}
            >
              <div className='w-1/6 text-center'>
                <span
                  data-tooltip-target={`tooltip-light-${project.id}`}
                  data-tooltip-style='light'
                  className='truncate block ltr hover:cursor-pointer underline'
                  type='button'
                  title={project.name}
                  onClick={() => goToProject(project.name)}
                >
                  {project.name}
                </span>
              </div>
              <div className='w-1/6 text-center'>{project.status}</div>
              {/* <div className='w-1/6 text-center'>{project.query_ids.length}</div> */}
              <div className='w-1/6 text-center'>{project.annotator || 'None'}</div>
              <div className='w-1/6 text-center'>{project.reviewer || 'None'}</div>
              <div className='w-1/6 flex'>
                <div className='relative'>
                  <MoreMenu
                    isOpen={isMoreMenuOpen && (project.id === selectedProjectId)}
                    selectProject={selectProject}
                    project={project}
                    role={role}
                  />
                </div>
                <More
                  onClick={e => {
                    e.stopPropagation()
                    toggleMoreMenu(project.id)
                  }}
                  className='cursor-pointer w-6 h-auto'
                  color={projectColors[project.status].color}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toast
        type={toastType}
        showToast={showToast}
        setShowToast={setShowToast}
        toastMsg={toastMsg}
      />
      {isArchiveModalOpen &&
        <ArchiveModal
          onClose={() => setIsArchiveModalOpen(false)}
          onConfirm={changeStatus}
        />
      }
      {isInReviewModalOpen &&
        <InReviewModal
          onClose={() => setIsInReviewModalOpen(false)}
          onConfirm={changeStatus}
          type={inReviewModalType}
        />
      }
      {isSelectUserModalOpen &&
        <SelectUserModal
          onClose={closeSelectUserModal}
          onConfirm={changeStatus}
          type={selectUserModalType}
          allUsers={users}
          selectedUserId={selectedUser ? selectedUser.id : null}
          selectUser={selectUser}
        />
      }
      {isMoreMenuOpen &&
        <div
          onClick={() => setIsMoreMenuOpen(false)}
          className='fixed top-0 left-0 w-full h-full'
        />
      }
    </div>
  )
}

export default ProjectsPage
