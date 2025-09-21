import React, { useRef, useState } from 'react'
import Play from './icons/Play.jsx'
import Pause from './icons/Pause.jsx'
import Fullsize from './icons/Fullsize.jsx'

const LargeGalleryItem = props => {
  const videoRef = useRef()
  const [showVideo, setShowVideo] = useState()
  const [videoIsPaused, setVideoIsPaused] = useState(true)
  const { data, isGalleryCard = false, goFullSize } = props
  const { video, preview, master_id } = data || {}

  const playVideo = () => {
    const { currentTime, paused, ended, duration } = videoRef.current

    if (duration) {
      const isPlaying = currentTime > 0 && !paused && !ended

      if (!isPlaying) {
        setShowVideo(true)
        videoRef.current.play()
        setVideoIsPaused(false)
      }
    }
  }

  const pasueVideo = () => {
    const { currentTime, paused, ended } = videoRef.current
    const isPlaying = currentTime > 0 && !paused && !ended

    if (isPlaying) {
      videoRef.current.pause()
      setVideoIsPaused(true)
    }
  }
  if (data && data.master_id !== undefined) {
    return (
      <div
      className={`border-[3px] bg-[#191724]  h-[60vh] w-[33vh] rounded-xl transition-colors border-transparent`}
      >
        <div
          className={`relative text-center w-full h-full rounded-xl`}
        >
          <video
            className={`absolute rounded-xl w-full max-h-full  ${showVideo ? 'z-10 opacity-100' : 'z-0 opacity-0'} duration-300 transition-opacity`}
            muted
            loop
            ref={videoRef}
            key={`${video}`}
          >
            <source src={`http://127.0.0.1:8002/statics/${video}`}/>
          </video>
          <img
            className={` rounded-xl w-full h-full  ${showVideo ? 'z-0 opacity-0' : 'z-10 opacity-100'} duration-300 transition-opacity`}
            src={`http://127.0.0.1:8002/statics/${preview}`}
          />
          <span className='absolute z-10 top-2 left-2 text-gray-700 bg-gray-400 opacity-80 text-3xl rounded-full w-12 h-12 flex items-center justify-center '>{master_id}</span>

          {isGalleryCard &&
            <span onClick={goFullSize} className='top-2 right-2 hover:cursor-pointer absolute z-10  text-gray-700 bg-gray-400 opacity-80 rounded-full w-12 h-12 flex items-center justify-center '>
              <Fullsize className='w-8 h-auto'/>
            </span>
          }
          {
            videoIsPaused &&
          <span onClick={playVideo} className=' hover:cursor-pointer absolute z-10 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-gray-700 bg-gray-400 opacity-20 hover:opacity-80 rounded-full w-16 h-16 flex items-center justify-center '>
            <Play className='w-6 h-auto'/>
          </span>
          }
          {
            !videoIsPaused &&
          <span onClick={pasueVideo} className=' hover:cursor-pointer absolute z-10 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-gray-700 bg-gray-400 opacity-20 hover:opacity-80 rounded-full w-16 h-16 flex items-center justify-center '>
            <Pause className='w-6 h-auto'/>
          </span>
          }
        </div>
      </div>
    )
  }
}

export default LargeGalleryItem
