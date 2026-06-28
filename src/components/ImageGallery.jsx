import { useState } from 'react'

export default function ImageGallery({ imageUrl, images = [] }) {
  const all = [imageUrl, ...images].filter(Boolean)
  const [activeIdx, setActiveIdx] = useState(0)

  if (all.length === 0) return null

  return (
    <div className="image-gallery">
      {/* Large active image */}
      <div className="image-gallery__main">
        <img src={all[activeIdx]} alt="" className="image-gallery__main-img" />
      </div>

      {/* Thumbnails — only if more than one image */}
      {all.length > 1 && (
        <div className="image-gallery__thumbs">
          {all.map((src, i) => (
            <button
              key={i}
              className={`image-gallery__thumb${i === activeIdx ? ' image-gallery__thumb--active' : ''}`}
              onClick={() => setActiveIdx(i)}
              aria-label={`Image ${i + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
