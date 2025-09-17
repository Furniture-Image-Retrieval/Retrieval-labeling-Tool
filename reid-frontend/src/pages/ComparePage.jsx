import React, { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Badge from '../components/Badge.jsx'
import Button from '../components/Button.jsx'

const ComparePage = () => {
  const [galleryUploadedSrc, setGalleryUploadedSrc] = useState(null)
  const [queryUploadedSrc, setQueryUploadedSrc] = useState(null)
  const galleryFileInput = useRef(null)
  const queryFileInput = useRef(null)
  const [searchParams] = useSearchParams()
  const gallerySrc = searchParams.get('g').replace('_StartingFrom_', '#t=')
  const querySrc = searchParams.get('q').replace('_StartingFrom_', '#t=')

  const handleClickUploadBtn = (e, item) => {
    if (item === 'query') {
      queryFileInput.current.click()
    } else if (item === 'gallery') {
      galleryFileInput.current.click()
    }
  }

  const handleUploadQueryFile = (e) => {
    setQueryUploadedSrc(`${URL.createObjectURL(e.target.files[0])}#t=${searchParams.get('q').split('_StartingFrom_')[1]}`)
  }

  const handleUploadGalleryFile = (e) => {
    setGalleryUploadedSrc(`${URL.createObjectURL(e.target.files[0])}#t=${searchParams.get('g').split('_StartingFrom_')[1]}`)
  }

  const createDownloadLink = (dwonloadUrl, item) => {
    const link = document.createElement('a')
    link.href = dwonloadUrl
    link.setAttribute('download', item)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div className='flex p-10 bg=[#f1f1f1] max-h-[calc(100vh-70px)]'>
      <div className='flex-1 flex bg-white rounded-2xl'>
        <div className='w-1/2 flex-1 flex justify-start flex-col p-4'>
          <p className='text-center pb-3'>
            <Badge>
              <span className='text-white'>gallery item</span>
            </Badge>
          </p>
          {galleryUploadedSrc
            ? <video src={galleryUploadedSrc} className='max-h-[90%]' controls />
            : (
              <video className='max-h-[90%]' controls>
                <source src={galleryUploadedSrc ?? gallerySrc} />
              </video>
            )
          }
          <div className='flex justify-between mt-2'>
            <Button className='w-[45%] cursor-pointer' onClick={() => createDownloadLink(gallerySrc, 'gallery')}>Download</Button>
            <Button className='w-[45%] cursor-pointer' onClick={(e) => handleClickUploadBtn(e, 'gallery')}>Upload</Button>
            <input className='hidden' type='file' ref={galleryFileInput} onChange={handleUploadGalleryFile} />
          </div>
        </div>
        <div className='w-1/2 flex-1 flex justify-start flex-col p-4'>
          <p className='text-center pb-3'>
            <Badge>
              <span className='text-white'>query item</span>
            </Badge>
          </p>
          {queryUploadedSrc
            ? <video src={queryUploadedSrc} className='max-h-[90%]' controls />
            : (
              <video className='max-h-[90%]' controls>
                <source src={queryUploadedSrc ?? querySrc} />
              </video>
            )
          }
          <div className='flex justify-between mt-2'>
            <Button className='w-[45%] cursor-pointer' onClick={() => createDownloadLink(querySrc, 'query')}>Download</Button>
            <Button className='w-[45%] cursor-pointer' onClick={(e) => handleClickUploadBtn(e, 'query')}>Upload</Button>
            <input className='hidden' type='file' ref={queryFileInput} onChange={handleUploadQueryFile} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparePage