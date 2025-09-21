import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import Button from './Button.jsx'
import Badge from './Badge.jsx'
import LargeGalleryItem from './LargeGalleryItem.jsx'
import ChevronL from '../components/icons/ChevronL.jsx'
import ChevronR from '../components/icons/ChevronR.jsx'

const Comparison = props => {
  const { 
    queryItem,
    galleryItem,
    activeQueryindex,
    totlaQueries,
    onNextQueryClick,
    onPrevQueryClick,
    onEnterQueryIndexDirectly,
    submitSelectedItems,
    submitNoMatch,
    thereIsChange,
    noMatchIsLoading,
    submitIsLoading
  } = props

  // const { gallery, query } = meta
  // const queryItemSrc = `http://127.0.0.1:8002/statics/${query}.mp4_StartingFrom_${queryItem?.start}`
  // const galleryItemSrc = `http://127.0.0.1:8002/statics/${gallery}.mp4_StartingFrom_${galleryItem?.start}`

  const [tempActiveQueryIndex, setTempActiveQueryIndex]= useState(activeQueryindex)
  useEffect(() => {
    if (tempActiveQueryIndex !== activeQueryindex) {
      setTempActiveQueryIndex(activeQueryindex)
    }
  }, [activeQueryindex])

  const goFullSize = () => {
    window.open(`/compare?q=${queryItemSrc}&g=${galleryItemSrc}`, '_blank')
  }
  return (
    <div className='h-full flex flex-col w-full max-w-[800px]'>
      <div className='flex justify-between bg-[#121119] rounded-xl p-2'>
        <Button disabled={!galleryItem || !thereIsChange} onClick={submitSelectedItems} loading={submitIsLoading} type='primary' title='confirm'/>
        <div className='flex items-center gap-x-2'>
          <ChevronR
            onClick={onNextQueryClick}
            className={`w-10 h-auto ${(activeQueryindex === totlaQueries - 1) ? 'text-gray-500' : ' text-gray-200 hover:cursor-pointer'}`}
          />
          <Badge >
            <div className='flex justify-center'>
              <div>
                {`${totlaQueries} / `}
              </div>
              <input
                className='bg-gray-400 flex no-arrows'
                type="number"
                style={{ width: '40px', textAlign: 'center' }} 
                value={tempActiveQueryIndex + 1}
                onChange={(e) => {setTempActiveQueryIndex(e.target.value - 1)}}
                onBlur={() => {
                  onEnterQueryIndexDirectly(tempActiveQueryIndex)}}
              />
            </div>
          </Badge>
          <ChevronL
            onClick={onPrevQueryClick}
            className={`w-10 h-auto ${(activeQueryindex === 0) ? 'text-gray-500' : ' text-gray-200 hover:cursor-pointer'}`}
          />
        </div>
        <Button disabled={!thereIsChange} onClick={submitNoMatch} loading={noMatchIsLoading} title='no match' />
      </div>
      <div className='flex-1 flex justify-center gap-5 pt-2'>
        <LargeGalleryItem isGalleryCard goFullSize={goFullSize} data={galleryItem}/>
        <LargeGalleryItem data={queryItem}/>
      </div>

    </div>
  )
}

export default Comparison
