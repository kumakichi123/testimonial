'use client'

import { useState } from 'react'

const STAR_SYMBOL = '\u2605'

const Star = ({
  value,
  filled,
  onClick,
}: {
  value: number
  filled: boolean
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-3xl transition-colors sm:text-4xl ${
      filled ? 'text-amber-400' : 'text-slate-300'
    }`}
    aria-label={`Select ${value} star${value > 1 ? 's' : ''}`}
  >
    {STAR_SYMBOL}
  </button>
)

export default function StarRating({
  name,
  initialRating = 0,
}: {
  name: string
  initialRating?: number
}) {
  const [rating, setRating] = useState(initialRating)

  const handleClick = (newRating: number) => {
    setRating(newRating)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input type="hidden" name={name} value={rating} />
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          value={star}
          filled={star <= rating}
          onClick={() => handleClick(star)}
        />
      ))}
      <span
        className="text-sm text-slate-500 sm:text-base"
        aria-live="polite"
      >
        {rating} / 5
      </span>
    </div>
  )
}
