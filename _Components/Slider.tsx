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
    <div className="relative w-full h-125 overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Texte */}
            <div className="flex flex-col justify-center px-6 md:px-10 lg:px-16 py-10 bg-gray-900">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {slide.title}
              </h1>

              <p className="mt-5 text-gray-300 text-base md:text-lg leading-relaxed">
                {slide.description}
              </p>
            </div>

            {/* Image */}
            <div className="relative min-h-70 lg:min-h-full">
              <Image
                src={slide.image_url}
                alt={slide.title || "slider image"}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${index === current
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white"
              }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slider