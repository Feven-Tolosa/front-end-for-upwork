import React, { useState, useEffect, useRef } from 'react'

const ComicBookPage = () => {
  const [coloredPixels, setColoredPixels] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isTurning, setIsTurning] = useState(false)
  const containerRef = useRef(null)
  const textRefs = useRef([])

  // Sample comic book content
  const pages = [
    {
      title: 'WELCOME TO THE COMIC ZONE',
      content:
        'This is where your adventure begins. Explore our world as it comes to life beneath your cursor.',
      background:
        "bg-[url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')]",
    },
    {
      title: 'OUR HEROES',
      content:
        'Meet the characters that will guide you through this journey. Each with unique powers and stories.',
      background:
        "bg-[url('https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')]",
    },
    {
      title: 'THE STORY',
      content:
        'Dive into an epic narrative that unfolds with every page turn. What mysteries await?',
      background:
        "bg-[url('https://images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')]",
    },
    {
      title: 'JOIN US',
      content:
        'Become part of our community and create your own comic adventures!',
      background:
        "bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80')]",
    },
  ]

  // Handle mouse movement to reveal color
  const handleMouseMove = (e) => {
    if (isTurning) return

    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Add new colored pixel
    const newPixel = { x, y, id: Date.now() + Math.random() }
    setColoredPixels((prev) => [...prev, newPixel])

    // Remove oldest pixel if we have too many
    if (coloredPixels.length > 1000) {
      setColoredPixels((prev) => prev.slice(1))
    }
  }

  // Handle scroll for page turn
  useEffect(() => {
    const handleScroll = (e) => {
      if (isTurning) return

      const delta = e.deltaY
      if (delta > 5 && currentPage < pages.length - 1) {
        // Scroll down - turn page forward
        turnPage(currentPage + 1)
      } else if (delta < -5 && currentPage > 0) {
        // Scroll up - turn page backward
        turnPage(currentPage - 1)
      }
    }

    window.addEventListener('wheel', handleScroll)
    return () => window.removeEventListener('wheel', handleScroll)
  }, [currentPage, isTurning])

  // Animate text letter by letter
  useEffect(() => {
    textRefs.current.forEach((ref, i) => {
      if (ref) {
        const text = ref.innerText
        ref.innerText = ''

        for (let j = 0; j < text.length; j++) {
          setTimeout(() => {
            const span = document.createElement('span')
            span.textContent = text[j]
            span.className = 'opacity-0 animate-fadeInComic'
            span.style.animationDelay = `${j * 0.05}s`
            ref.appendChild(span)
          }, 100 + i * 200)
        }
      }
    })
  }, [currentPage])

  // Page turn animation
  const turnPage = (newPage) => {
    setIsTurning(true)
    setCurrentPage(newPage)

    // Reset colored pixels on new page
    setColoredPixels([])

    // Animation complete
    setTimeout(() => {
      setIsTurning(false)
    }, 1000)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`
        relative w-screen h-screen overflow-hidden 
        ${pages[currentPage].background} bg-cover bg-center
        ${isTurning ? 'animate-pageTurn' : ''}
        grayscale hover:grayscale-0 transition-all duration-500
      `}
    >
      {/* Colored pixel overlay */}
      <div className='absolute inset-0 pointer-events-none mix-blend-overlay'>
        {coloredPixels.map((pixel) => (
          <div
            key={pixel.id}
            className='absolute w-24 h-24 rounded-full bg-gradient-to-b from-white/80 to-white/0 opacity-70'
            style={{
              left: `${pixel.x}px`,
              top: `${pixel.y}px`,
            }}
          />
        ))}
      </div>

      {/* Comic page content */}
      <div className='relative w-4/5 h-4/5 mx-auto my-[5%] bg-white border-4 border-black shadow-xl p-8 overflow-hidden'>
        <div className='relative z-10 h-full flex flex-col justify-center items-center text-center'>
          <h1
            ref={(el) => (textRefs.current[0] = el)}
            className='text-5xl mb-8 uppercase tracking-wider text-black font-comic'
          >
            {pages[currentPage].title}
          </h1>
          <p
            ref={(el) => (textRefs.current[1] = el)}
            className='text-2xl max-w-[70%] leading-relaxed font-comic'
          >
            {pages[currentPage].content}
          </p>
        </div>

        {/* Page corner for visual effect */}
        <div className='absolute top-5 right-5 w-14 h-14 bg-gradient-to-br from-transparent from-50% to-gray-500 to-50% z-20'></div>
      </div>

      {/* Page turn indicator */}
      {currentPage < pages.length - 1 && (
        <div className='fixed bottom-5 left-1/2 -translate-x-1/2 text-white text-xl text-shadow animate-bounce font-comic'>
          ▼ Scroll to turn page ▼
        </div>
      )}
    </div>
  )
}

export default ComicBookPage
