import { useState, useEffect, useRef } from 'react'

const ComicBookPage = () => {
  const [coloredPixels, setColoredPixels] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isTurning, setIsTurning] = useState(false)
  const containerRef = useRef(null)

  // Demo content
  const pages = [
    {
      title: 'WELCOME TO THE COMIC ZONE',
      content: 'Move your cursor to reveal color! Scroll to turn pages.',
      background: 'bg-gradient-to-br from-gray-900 to-gray-700',
    },
    {
      title: 'PAGE 2',
      content: 'This is the second page of our comic adventure.',
      background: 'bg-gradient-to-br from-blue-900 to-blue-700',
    },
  ]

  const handleMouseMove = (e) => {
    const container = containerRef.current
    if (!container || isTurning) return

    const rect = container.getBoundingClientRect()
    setColoredPixels((prev) => [
      ...prev.slice(-1000), // Keep only 1000 pixels
      {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        id: Date.now() + Math.random(),
      },
    ])
  }

  useEffect(() => {
    const handleScroll = (e) => {
      if (isTurning) return
      if (e.deltaY > 5 && currentPage < pages.length - 1) {
        turnPage(currentPage + 1)
      } else if (e.deltaY < -5 && currentPage > 0) {
        turnPage(currentPage - 1)
      }
    }

    window.addEventListener('wheel', handleScroll)
    return () => window.removeEventListener('wheel', handleScroll)
  }, [currentPage, isTurning])

  const turnPage = (newPage) => {
    setIsTurning(true)
    setTimeout(() => {
      setCurrentPage(newPage)
      setColoredPixels([])
      setIsTurning(false)
    }, 1000)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full h-full ${pages[currentPage].background} ${
        isTurning ? 'animate-pageTurn' : ''
      }`}
    >
      {/* Color reveal effect */}
      <div className='absolute inset-0 pointer-events-none mix-blend-overlay'>
        {coloredPixels.map((pixel) => (
          <div
            key={pixel.id}
            className='absolute w-24 h-24 rounded-full bg-gradient-to-b from-yellow-400/80 to-transparent'
            style={{
              left: `${pixel.x}px`,
              top: `${pixel.y}px`,
            }}
          />
        ))}
      </div>

      {/* Comic page content */}
      <div className='absolute inset-10 bg-white border-8 border-black p-8 overflow-hidden'>
        <h1 className='text-4xl font-comic mb-4'>{pages[currentPage].title}</h1>
        <p className='text-2xl font-comic'>{pages[currentPage].content}</p>
      </div>

      {/* Debug info - remove in production */}
      <div className='absolute bottom-4 left-4 bg-black/80 text-white p-2 rounded'>
        Page {currentPage + 1}/{pages.length} | Pixels: {coloredPixels.length}
      </div>
    </div>
  )
}

export default ComicBookPage
