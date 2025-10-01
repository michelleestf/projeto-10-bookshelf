"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  size?: number;
  className?: string;
}

export function StarRating({
  rating,
  onRatingChange,
  maxRating = 5,
  size = 20,
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);

        return (
          <button
            key={index}
            type="button"
            className="transition-colors duration-150 hover:scale-110 transform"
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(starValue)}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              } transition-colors duration-150`}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">
        {rating > 0 ? `${rating}/5` : "Sem avaliação"}
      </span>
    </div>
  );
}
