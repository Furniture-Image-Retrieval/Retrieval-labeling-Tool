import React, { useRef, useState } from 'react'

const GalleryItem = (props) => {
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef()
  const { data, onSelect, onRemove, isSelected } = props
  const { video, preview, master_id } = data

  const playVideo = () => {
    const { currentTime, paused, ended, duration } = videoRef.current

    if (duration) {
      const isPlaying = currentTime > 0 && !paused && !ended

      if (!isPlaying) {
        setShowVideo(true)
        videoRef.current.play()
      }
    }
  }

  const stopVideo = () => {
    const { currentTime, paused, ended } = videoRef.current
    const isPlaying = currentTime > 0 && !paused && !ended

    if (isPlaying) {
      setShowVideo(false)
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div
      onMouseOver={playVideo}
      onMouseOut={stopVideo}
      className={` border-[3px] w-36 h-[256px] bg-[#191724] rounded-xl transition-colors ${isSelected ? 'border-green-400' : ' border-transparent'}`}
    >
      <div
        className={`relative text-center w-full h-full rounded-xl hover:cursor-pointer `}
        onClick={() => {
          if (isSelected) {
            onRemove()
          } else {
            onSelect()
          }
        }}
      >
        <video
          className={`absolute rounded-xl w-full h-full  ${showVideo ? 'z-10 opacity-100' : 'z-0 opacity-0'} duration-300 transition-opacity`}
          muted
          loop
          ref={videoRef}
        >
          <source src={`http://172.17.13.44:8002/statics/${video}`}/>
        </video>
        <img
          className={`absolute rounded-xl w-full h-full  ${showVideo ? 'z-0 opacity-0' : 'z-10 opacity-100'} duration-300 transition-opacity`}
          src={`http://172.17.13.44:8002/statics/${preview}`}
        />
        <span className='absolute z-10 top-2 left-2 text-gray-700 bg-gray-400 opacity-80 text-xl rounded-full w-8 h-8 text-center '>{master_id}</span>
      </div>
    </div>
  )
}

export default GalleryItem
