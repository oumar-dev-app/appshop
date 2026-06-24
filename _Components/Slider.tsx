'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

type SlideType = {
  id: number
  image_url: string
  title?: string
  description?: string
}

const Slider = () => {
  const [slides, setSlides] = useState<SlideType[]>([])
  const [current, setCurrent] = useState(0)

  // Fetch images
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const token = localStorage.getItem('token')

        const res = await fetch('/api/homebar', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        setSlides(data.data || [])
      } catch (error) {
        console.error(error)
      }
    }

    fetchSlides();
  }, [])

  // Auto slider
  useEffect(() => {
    if (slides.length === 0) return

    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [slides])

  return (
    <div className="relative w-full h-125 overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`
            absolute inset-0 transition-opacity duration-1000
            ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}
          `}
        >
          <Image
            src={slide.image_url}
            alt={slide.title || 'slider image'}
            fill
            priority
            className="h-50 object-cover w-full rounded-t-lg"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-white text-5xl font-bold">
              {slide.title}
            </h1>

            <p className="text-white mt-4 text-lg max-w-2xl">
              {slide.description}
            </p>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${index === current
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white'
              }
            `}
          />
        ))}
      </div>
    </div>
  )
}

export default Slider