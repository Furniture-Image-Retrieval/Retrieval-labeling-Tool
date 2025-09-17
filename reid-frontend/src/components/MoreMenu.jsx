import React from 'react'

const MoreMenu = (props) => {
  const {
    isOpen,
    selectProject,
    project,
    role,
  } = props

  if (!isOpen) return

  const { status } = project

  return (
    <ul className='ltr absolute bg-slate-600 rounded z-10 right-0 top-1 w-40' style={{ color: 'white' }}>
      {(status === 'to do' && role === 'admin') &&
        <li
          onClick={e => {
            e.stopPropagation()
            selectProject(project)
          }}
          className='cursor-pointer p-2'
        >
          Choose Annotaor
        </li>
      }
      {status === 'req to review' && role === 'admin' &&
        <li
          onClick={e => {
            e.stopPropagation()
            selectProject(project)
          }}
          className='cursor-pointer p-2'
        >
          Choose Reviewer
        </li>
      }
      {status === 'req to review' && role === 'reviewer' &&
        <li
          onClick={e => {
            e.stopPropagation()
            selectProject(project)
          }}
          className='cursor-pointer p-2'
        >
          Assign To Me
        </li>
      }
      {(status === 'in review' && role === 'reviewer') && (
        <>
          <li
            onClick={e => {
              e.stopPropagation()
              selectProject(project, 'goForward')
            }}
            className='cursor-pointer p-2'
          >
            Complete Review
          </li>
          <li
            onClick={e => {
              e.stopPropagation()
              selectProject(project, 'goBackward')
            }}
            className='cursor-pointer p-2'
          >
            Re-Annotate
          </li>
        </>
      )}
      {role === 'admin' && status !== 'archive' &&
        <li
          onClick={e => {
            e.stopPropagation()
            selectProject(project, 'makeArchive')
          }}
          className='cursor-pointer p-2'
        >
          Archive Project
        </li>
      }
      {status === 'in annotation' && role === 'annotator' &&
        <li
          onClick={e => {
            e.stopPropagation()
            selectProject(project)
          }}
          className='cursor-pointer p-2'
        >
          Complete Annotation
        </li>
      }
      {status === 'archive' && role === 'admin' &&
        <li
          onClick={e => {
            e.stopPropagation()
            selectProject(project)
          }}
          className='cursor-pointer p-2'
        >
          Make Project To Do
        </li>
      }
    </ul>
  )
}

export default MoreMenu
